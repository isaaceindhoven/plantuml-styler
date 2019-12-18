export interface ZipEntry {
    version: number;
    bitFlag: number;
    compressionMethod: number;
    lastModDateRaw: number;
    lastModDate: string;
    crc32: number;
    compressedSize: number;
    uncompressedSize: number;
    filenameLength: number;
    extraFieldLength: number;
    commentLength: number;
    directory: boolean;
    offset: 0;
    filename: string;
    comment: string;
  }
