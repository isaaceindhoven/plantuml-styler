import Page from './page';

fixture`My first fixture`
    .page`localhost:4200`;

const page = new Page();

test('My first test', async t => {
    await t
        .click(page.themes)
        .click(page.notheme)
        .click(page.themeSelect)
        .click(page.interfaceSelectJohan)
        .click(page.text)
        .click(page.textArea)
        .pressKey('ctrl+a delete')
        .typeText(page.textArea, `title <b>Server flow</b>\nactor Customer\nparticipant Merchant\nparticipant SDK\nautonumber 1\nCustomer->Merchant:Start checkout\n... ...\nautonumber 11\nMerchant->SDK:client.createPayment(//body//)\nSDK->Merchant:Return //CreatePaymentResponse//\nMerchant	->	Merchant:	Store relevant information\nMerchant	->	ThirdParty:	302 //redirectUrl//\nThirdParty	->	Merchant:	GET //returnUrl//\nMerchant	->	Merchant:	Compare //RETURNMAC// from //returnUrl// with stored value\nMerchant	->	SDK:		client.getPayment(//paymentId//)\nSDK->Merchant:Return //PaymentResponse//\nMerchant->Merchant:Check status and act on response (e.g. deliver goods)\nMerchant->Customer:Return control to customer`, { paste: true })
        .click(page.themes)
        .click(page.usetheme)
        .click(page.themes)
        .click(page.colors)
        .click(page.color1)
        .pressKey('ctrl+a delete')
        .typeText(page.color1, '#dd85a2', { paste: true })
        .click(page.color2)
        .pressKey('ctrl+a delete')
        .typeText(page.color2, '#2b2594', { paste: true })
        .click(page.color3)
        .pressKey('ctrl+a delete')
        .typeText(page.color3, '#30adb8', { paste: true })
        .click(page.color4)
        .pressKey('ctrl+a delete')
        .typeText(page.color4, '#426caa', { paste: true })
        .click(page.color5)
        .pressKey('ctrl+a delete')
        .typeText(page.color5, '#55b958', { paste: true })
        .click(page.color6)
        .pressKey('ctrl+a delete')
        .typeText(page.color6, '#2c8488', { paste: true })
        .click(page.color7)
        .pressKey('ctrl+a delete')
        .typeText(page.color7, '#78ac7e', { paste: true })
        .click(page.color8)
        .pressKey('ctrl+a delete')
        .typeText(page.color8, '#218e77', { paste: true })
        .click(page.color9)
        .pressKey('ctrl+a delete')
        .typeText(page.color9, '#35c9bc', { paste: true })
        .click(page.colors)
        .click(page.styling)
        .click(page.numberSelect)
        .click(page.interfaceSelectRound)
        .click(page.breakSelect)
        .click(page.interfaceSelectSquiggly)
        .click(page.styling)

});     