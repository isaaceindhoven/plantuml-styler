/* jshint worker:true */
(function main(global) {
	"use strict";

	if (global.zWorkerInitialized)
		throw new Error('z-worker.js should be run only once');
	global.zWorkerInitialized = true;

	addEventListener("message", function(event) {
		let message = event.data, type = message.type, sn = message.sn;
		let handler = handlers[type];
		if (handler) {
			try {
				handler(message);
			} catch (e) {
				onError(type, sn, e);
			}
		}
		//for debug
		//postMessage({type: 'echo', originalType: type, sn: sn});
	});

	let handlers = {
		importScripts: doImportScripts,
		newTask: newTask,
		append: processData,
		flush: processData,
	};

	// deflater/inflater tasks indexed by serial numbers
	let tasks = {};

	function doImportScripts(msg) {
		if (msg.scripts && msg.scripts.length > 0)
			importScripts.apply(undefined, msg.scripts);
		postMessage({type: 'importScripts'});
	}

	function newTask(msg) {
		let CodecClass = global[msg.codecClass];
		let sn = msg.sn;
		if (tasks[sn])
			throw Error('duplicated sn');
		tasks[sn] =  {
			codec: new CodecClass(msg.options),
			crcInput: msg.crcType === 'input',
			crcOutput: msg.crcType === 'output',
			crc: new Crc32(),
		};
		postMessage({type: 'newTask', sn: sn});
	}

	// performance may not be supported
	let now = global.performance ? global.performance.now.bind(global.performance) : Date.now;

	function processData(msg) {
		let sn = msg.sn, type = msg.type, input = msg.data;
		let task = tasks[sn];
		// allow creating codec on first append
		if (!task && msg.codecClass) {
			newTask(msg);
			task = tasks[sn];
		}
		let isAppend = type === 'append';
		let start = now();
		let output;
		if (isAppend) {
			try {
				output = task.codec.append(input, function onprogress(loaded) {
					postMessage({type: 'progress', sn: sn, loaded: loaded});
				});
			} catch (e) {
				delete tasks[sn];
				throw e;
			}
		} else {
			delete tasks[sn];
			output = task.codec.flush();
		}
		let codecTime = now() - start;

		start = now();
		if (input && task.crcInput)
			task.crc.append(input);
		if (output && task.crcOutput)
			task.crc.append(output);
		let crcTime = now() - start;

		let rmsg = {type: type, sn: sn, codecTime: codecTime, crcTime: crcTime};
		let transferables = [];
		if (output) {
			rmsg.data = output;
			transferables.push(output.buffer);
		}
		if (!isAppend && (task.crcInput || task.crcOutput))
			rmsg.crc = task.crc.get();
		
		// posting a message with transferables will fail on IE10
		try {
			postMessage(rmsg, transferables);
		} catch(ex) {
			postMessage(rmsg); // retry without transferables
		}
	}

	function onError(type, sn, e) {
		let msg = {
			type: type,
			sn: sn,
			error: formatError(e)
		};
		postMessage(msg);
	}

	function formatError(e) {
		return { message: e.message, stack: e.stack };
	}

	// Crc32 code copied from file zip.js
	function Crc32() {
		this.crc = -1;
	}
	Crc32.prototype.append = function append(data) {
		let crc = this.crc | 0, table = this.table;
		for (let offset = 0, len = data.length | 0; offset < len; offset++)
			crc = (crc >>> 8) ^ table[(crc ^ data[offset]) & 0xFF];
		this.crc = crc;
	};
	Crc32.prototype.get = function get() {
		return ~this.crc;
	};
	Crc32.prototype.table = (function() {
		let i, j, t, table = []; // Uint32Array is actually slower than []
		for (i = 0; i < 256; i++) {
			t = i;
			for (j = 0; j < 8; j++)
				if (t & 1)
					t = (t >>> 1) ^ 0xEDB88320;
				else
					t = t >>> 1;
			table[i] = t;
		}
		return table;
	})();

	// "no-op" codec
	function NOOP() {}
	global.NOOP = NOOP;
	NOOP.prototype.append = function append(bytes, onprogress) {
		return bytes;
	};
	NOOP.prototype.flush = function flush() {};
})(this);