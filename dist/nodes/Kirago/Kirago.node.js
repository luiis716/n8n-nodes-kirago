"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirago = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const message_1 = require("./resources/message");
class Kirago {
    constructor() {
        this.description = {
            displayName: 'Kirago',
            name: 'kirago',
            icon: { light: 'file:kirago.svg', dark: 'file:kirago.dark.svg' },
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Interact with the Kirago API',
            defaults: {
                name: 'Kirago',
            },
            usableAsTool: true,
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [{ name: 'kiragoApi', required: true }],
            requestDefaults: {
                baseURL: '={{$credentials.baseUrl}}',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Message',
                            value: 'message',
                        },
                    ],
                    default: 'message',
                },
                ...message_1.messageDescription,
            ],
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        const items = this.getInputData();
        const returnData = [];
        const credentials = (await this.getCredentials('kiragoApi'));
        const baseURL = credentials.baseUrl.endsWith('/') ? credentials.baseUrl : `${credentials.baseUrl}/`;
        const buildContextInfo = (extra) => {
            var _a;
            const context = {};
            if (extra.stanzaId)
                context.StanzaId = extra.stanzaId;
            if (extra.participant)
                context.Participant = extra.participant;
            if (extra.isForwarded)
                context.IsForwarded = true;
            const mentioned = (_a = extra.mentionedJid) === null || _a === void 0 ? void 0 : _a.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
            if (mentioned === null || mentioned === void 0 ? void 0 : mentioned.length)
                context.MentionedJID = mentioned;
            return context;
        };
        const post = async (url, body) => this.helpers.httpRequestWithAuthentication.call(this, 'kiragoApi', {
            method: 'POST',
            url,
            baseURL,
            body,
            json: true,
        });
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            if (resource !== 'message') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`);
            }
            if (operation === 'sendText') {
                const phone = this.getNodeParameter('phone', i);
                const bodyText = this.getNodeParameter('body', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                const payload = {
                    Phone: phone,
                    Body: bodyText,
                    LinkPreview: extra.linkPreview !== undefined
                        ? extra.linkPreview
                        : true,
                };
                if (extra.id)
                    payload.Id = extra.id;
                if (extra.quotedText)
                    payload.QuotedText = extra.quotedText;
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/text', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendImage') {
                const phone = this.getNodeParameter('phone', i);
                const image = this.getNodeParameter('image', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                const payload = {
                    Phone: phone,
                    Image: image,
                };
                if (extra.caption)
                    payload.Caption = extra.caption;
                if (extra.id)
                    payload.Id = extra.id;
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/image', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendAudio') {
                const phone = this.getNodeParameter('phone', i);
                const audio = this.getNodeParameter('audio', i);
                const ptt = this.getNodeParameter('ptt', i);
                const mimeType = this.getNodeParameter('mimeType', i);
                const seconds = this.getNodeParameter('seconds', i);
                const waveformRaw = this.getNodeParameter('waveform', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                let waveform = waveformRaw;
                try {
                    waveform = JSON.parse(waveformRaw);
                }
                catch {
                    waveform = waveformRaw;
                }
                const payload = {
                    Phone: phone,
                    Audio: audio,
                    PTT: ptt,
                    MimeType: mimeType,
                    Seconds: seconds,
                    Waveform: waveform,
                };
                if (extra.id)
                    payload.Id = extra.id;
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/audio', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendButtons') {
                const phone = this.getNodeParameter('phone', i);
                const title = ((_a = this.getNodeParameter('title', i)) !== null && _a !== void 0 ? _a : '').trim();
                const bodyText = this.getNodeParameter('body', i);
                const footerText = this.getNodeParameter('footer', i);
                const headerType = this.getNodeParameter('headerType', i) || 'none';
                let headerMediaUrl = '';
                let headerThumbnailUrl = '';
                if (headerType !== 'none') {
                    headerMediaUrl = ((_b = this.getNodeParameter('headerMediaUrl', i)) !== null && _b !== void 0 ? _b : '').trim();
                    if (headerType === 'video') {
                        headerThumbnailUrl = ((_c = this.getNodeParameter('headerThumbnailUrl', i)) !== null && _c !== void 0 ? _c : '').trim();
                    }
                }
                const buttonsRaw = this.getNodeParameter('buttons', i);
                const buttons = (_d = buttonsRaw === null || buttonsRaw === void 0 ? void 0 : buttonsRaw.button) !== null && _d !== void 0 ? _d : [];
                if (!buttons.length) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one button is required');
                }
                if (buttons.length > 3) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'A maximum of 3 buttons is allowed');
                }
                if (headerType && headerType !== 'none' && headerType !== 'image' && headerType !== 'video') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported header type: ${headerType}`);
                }
                if (headerType !== 'none' && !headerMediaUrl) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Header Media URL is required when Header Type is Image/Video');
                }
                const payload = {
                    phone,
                    body: bodyText,
                    buttons: buttons.map((b) => {
                        var _a, _b, _c, _d, _e;
                        const baseParams = {
                            display_text: b.displayText,
                        };
                        if (b.buttonType === 'quick_reply') {
                            const buttonId = ((_a = b.buttonId) !== null && _a !== void 0 ? _a : '').trim();
                            if (!buttonId) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Button ID is required for Quick Reply');
                            }
                            baseParams.id = buttonId;
                        }
                        else if (b.buttonType === 'cta_url') {
                            const url = ((_b = b.url) !== null && _b !== void 0 ? _b : '').trim();
                            const merchantUrl = ((_c = b.merchantUrl) !== null && _c !== void 0 ? _c : '').trim();
                            if (!url) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'URL is required for CTA URL');
                            }
                            baseParams.url = url;
                            baseParams.merchant_url = merchantUrl || url;
                        }
                        else if (b.buttonType === 'cta_copy') {
                            const copyCode = ((_d = b.copyCode) !== null && _d !== void 0 ? _d : '').trim();
                            if (!copyCode) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Copy Code is required for CTA Copy');
                            }
                            baseParams.copy_code = copyCode;
                        }
                        else if (b.buttonType === 'cta_call') {
                            const phoneNumber = ((_e = b.phoneNumber) !== null && _e !== void 0 ? _e : '').trim();
                            if (!phoneNumber) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Phone Number is required for CTA Call');
                            }
                            baseParams.phoneNumber = phoneNumber;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported button type: ${b.buttonType}`);
                        }
                        return {
                            name: b.buttonType,
                            buttonParamsJson: baseParams,
                        };
                    }),
                };
                if (title)
                    payload.title = title;
                if (footerText)
                    payload.footer = footerText;
                if (headerType && headerType !== 'none') {
                    const header = {
                        type: headerType,
                        media_url: headerMediaUrl,
                    };
                    if (headerType === 'video' && headerThumbnailUrl) {
                        header.thumbnail_url = headerThumbnailUrl;
                    }
                    payload.header = header;
                }
                const response = await post('/chat/send/buttons', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendCarousel') {
                const phone = this.getNodeParameter('phone', i);
                const carouselType = this.getNodeParameter('carouselType', i) || 'global';
                const text = ((_e = this.getNodeParameter('text', i)) !== null && _e !== void 0 ? _e : '').trim();
                const footer = ((_f = this.getNodeParameter('footer', i)) !== null && _f !== void 0 ? _f : '').trim();
                const viewOnce = this.getNodeParameter('viewOnce', i);
                const id = ((_g = this.getNodeParameter('id', i)) !== null && _g !== void 0 ? _g : '').trim();
                const quotedText = ((_h = this.getNodeParameter('quotedText', i)) !== null && _h !== void 0 ? _h : '').trim();
                const extra = this.getNodeParameter('additionalFields', i) || {};
                if (carouselType !== 'global' && carouselType !== 'per_card') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported carousel type: ${carouselType}`);
                }
                const buildNativeFlowButton = (b) => {
                    var _a, _b, _c, _d, _e;
                    const buttonType = ((_a = b.buttonType) !== null && _a !== void 0 ? _a : '').trim();
                    const displayText = ((_b = b.displayText) !== null && _b !== void 0 ? _b : '').trim();
                    if (!displayText) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Display Text is required');
                    }
                    const buttonParams = {
                        display_text: displayText,
                    };
                    if (buttonType === 'quick_reply') {
                        const buttonId = ((_c = b.buttonId) !== null && _c !== void 0 ? _c : '').trim();
                        if (!buttonId)
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Button ID is required for Quick Reply');
                        buttonParams.id = buttonId;
                    }
                    else if (buttonType === 'cta_url') {
                        const url = ((_d = b.url) !== null && _d !== void 0 ? _d : '').trim();
                        const merchantUrl = ((_e = b.merchantUrl) !== null && _e !== void 0 ? _e : '').trim();
                        if (!url)
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'URL is required for CTA URL');
                        buttonParams.url = url;
                        buttonParams.merchant_url = merchantUrl || url;
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported button type: ${buttonType}`);
                    }
                    return {
                        name: buttonType,
                        buttonParams,
                    };
                };
                let cardButtons = [];
                if (carouselType === 'global') {
                    const cardButtonsRaw = this.getNodeParameter('cardButtons', i) || {};
                    cardButtons = (_j = cardButtonsRaw.button) !== null && _j !== void 0 ? _j : [];
                }
                const cardsRaw = this.getNodeParameter('cards', i);
                const cards = (_k = cardsRaw.card) !== null && _k !== void 0 ? _k : [];
                if (!cards.length) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one card is required');
                }
                const payload = {
                    Phone: phone,
                    Cards: cards.map((c, cardIndex) => {
                        var _a, _b, _c, _d, _e, _f;
                        const image = ((_a = c.image) !== null && _a !== void 0 ? _a : '').trim();
                        if (!image) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Image is required (card ${cardIndex + 1})`);
                        }
                        const title = ((_b = c.title) !== null && _b !== void 0 ? _b : '').trim();
                        const caption = ((_c = c.caption) !== null && _c !== void 0 ? _c : '').trim();
                        const footer = ((_d = c.footer) !== null && _d !== void 0 ? _d : '').trim();
                        const cardPayload = { Image: image };
                        if (title)
                            cardPayload.Title = title;
                        if (caption)
                            cardPayload.Caption = caption;
                        if (footer)
                            cardPayload.Footer = footer;
                        if (carouselType === 'per_card') {
                            const buttons = (_f = (_e = c.buttons) === null || _e === void 0 ? void 0 : _e.button) !== null && _f !== void 0 ? _f : [];
                            if (buttons.length) {
                                cardPayload.Buttons = buttons.map(buildNativeFlowButton);
                            }
                        }
                        return cardPayload;
                    }),
                    ViewOnce: viewOnce,
                };
                if (text)
                    payload.Text = text;
                if (footer)
                    payload.Footer = footer;
                if (id)
                    payload.Id = id;
                if (quotedText)
                    payload.QuotedText = quotedText;
                if (carouselType === 'global' && cardButtons.length) {
                    payload.CardButtons = cardButtons.map(buildNativeFlowButton);
                }
                const context = buildContextInfo(extra);
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/carousel', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendList') {
                const phone = this.getNodeParameter('phone', i);
                const listMode = this.getNodeParameter('listMode', i) || 'sections';
                const topText = ((_l = this.getNodeParameter('topText', i)) !== null && _l !== void 0 ? _l : '').trim();
                const desc = ((_m = this.getNodeParameter('desc', i)) !== null && _m !== void 0 ? _m : '').trim();
                const buttonText = ((_o = this.getNodeParameter('buttonText', i)) !== null && _o !== void 0 ? _o : '').trim();
                const footerText = ((_p = this.getNodeParameter('footerText', i)) !== null && _p !== void 0 ? _p : '').trim();
                if (!topText)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Top Text is required');
                if (!desc)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Description is required');
                if (!buttonText)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Button Text is required');
                const payload = {
                    Phone: phone,
                    TopText: topText,
                    Desc: desc,
                    ButtonText: buttonText,
                };
                if (footerText)
                    payload.FooterText = footerText;
                if (listMode === 'sections') {
                    const sectionsRaw = this.getNodeParameter('sections', i);
                    const sections = (_q = sectionsRaw === null || sectionsRaw === void 0 ? void 0 : sectionsRaw.section) !== null && _q !== void 0 ? _q : [];
                    if (!sections.length) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one section is required');
                    }
                    payload.Sections = sections.map((s, sectionIndex) => {
                        var _a, _b, _c;
                        const sectionTitle = ((_a = s.title) !== null && _a !== void 0 ? _a : '').trim();
                        if (!sectionTitle) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Section title is required (section ${sectionIndex + 1})`);
                        }
                        const rows = (_c = (_b = s.rows) === null || _b === void 0 ? void 0 : _b.row) !== null && _c !== void 0 ? _c : [];
                        if (!rows.length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `At least one row is required (section ${sectionIndex + 1})`);
                        }
                        return {
                            title: sectionTitle,
                            rows: rows.map((r, rowIndex) => {
                                var _a, _b, _c;
                                const rowId = ((_a = r.rowId) !== null && _a !== void 0 ? _a : '').trim();
                                const rowTitle = ((_b = r.title) !== null && _b !== void 0 ? _b : '').trim();
                                const rowDesc = ((_c = r.desc) !== null && _c !== void 0 ? _c : '').trim();
                                if (!rowId) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Row ID is required (section ${sectionIndex + 1}, row ${rowIndex + 1})`);
                                }
                                if (!rowTitle) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Row title is required (section ${sectionIndex + 1}, row ${rowIndex + 1})`);
                                }
                                const rowPayload = { RowId: rowId, title: rowTitle };
                                if (rowDesc)
                                    rowPayload.desc = rowDesc;
                                return rowPayload;
                            }),
                        };
                    });
                }
                else if (listMode === 'legacy') {
                    const listRaw = this.getNodeParameter('list', i);
                    const list = (_r = listRaw === null || listRaw === void 0 ? void 0 : listRaw.row) !== null && _r !== void 0 ? _r : [];
                    if (!list.length) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one row is required');
                    }
                    payload.List = list.map((r, rowIndex) => {
                        var _a, _b, _c;
                        const rowId = ((_a = r.rowId) !== null && _a !== void 0 ? _a : '').trim();
                        const rowTitle = ((_b = r.title) !== null && _b !== void 0 ? _b : '').trim();
                        const rowDesc = ((_c = r.desc) !== null && _c !== void 0 ? _c : '').trim();
                        if (!rowId)
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Row ID is required (row ${rowIndex + 1})`);
                        if (!rowTitle)
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Row title is required (row ${rowIndex + 1})`);
                        const rowPayload = { RowId: rowId, title: rowTitle };
                        if (rowDesc)
                            rowPayload.desc = rowDesc;
                        return rowPayload;
                    });
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported list mode: ${listMode}`);
                }
                const response = await post('/chat/send/list', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendOrderDetails') {
                const jid = ((_s = this.getNodeParameter('jid', i)) !== null && _s !== void 0 ? _s : '').trim();
                const referenceId = ((_t = this.getNodeParameter('referenceId', i)) !== null && _t !== void 0 ? _t : '').trim();
                const total = this.getNodeParameter('total', i);
                const itemName = ((_u = this.getNodeParameter('itemName', i)) !== null && _u !== void 0 ? _u : '').trim();
                const itemQty = this.getNodeParameter('itemQty', i);
                const merchantName = ((_v = this.getNodeParameter('merchantName', i)) !== null && _v !== void 0 ? _v : '').trim();
                const pixKey = ((_w = this.getNodeParameter('pixKey', i)) !== null && _w !== void 0 ? _w : '').trim();
                const pixKeyType = this.getNodeParameter('pixKeyType', i) || 'EVP';
                const boletoLine = ((_x = this.getNodeParameter('boletoLine', i)) !== null && _x !== void 0 ? _x : '').trim();
                const pdfHeaderUrl = ((_y = this.getNodeParameter('pdfHeaderUrl', i)) !== null && _y !== void 0 ? _y : '').trim();
                const body = ((_z = this.getNodeParameter('body', i)) !== null && _z !== void 0 ? _z : '').trim();
                const footer = ((_0 = this.getNodeParameter('footer', i)) !== null && _0 !== void 0 ? _0 : '').trim();
                const referral = ((_1 = this.getNodeParameter('referral', i)) !== null && _1 !== void 0 ? _1 : '').trim();
                const sharePaymentStatus = this.getNodeParameter('sharePaymentStatus', i);
                if (!jid)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'JID is required');
                if (!referenceId)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Reference ID is required');
                if (!itemName)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Item Name is required');
                if (!merchantName)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Merchant Name is required');
                if (!itemQty || itemQty <= 0)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Item Qty must be greater than 0');
                if (total === undefined || total === null || Number.isNaN(total)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Total is required');
                }
                if (total <= 0)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Total must be greater than 0');
                if (!pixKey && !boletoLine) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Provide at least one payment method (PIX Key or Boleto Line)');
                }
                const payload = {
                    jid,
                    referenceId,
                    total,
                    itemName,
                    itemQty,
                    merchantName,
                    sharePaymentStatus,
                };
                if (pixKey) {
                    payload.pixKey = pixKey;
                    payload.pixKeyType = pixKeyType;
                }
                if (boletoLine)
                    payload.boletoLine = boletoLine;
                if (pdfHeaderUrl)
                    payload.pdfHeaderUrl = pdfHeaderUrl;
                if (body)
                    payload.body = body;
                if (footer)
                    payload.footer = footer;
                if (referral)
                    payload.referral = referral;
                const response = await post('/chat/send/order-details', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendPixPayment') {
                const phone = this.getNodeParameter('phone', i);
                const title = ((_2 = this.getNodeParameter('title', i)) !== null && _2 !== void 0 ? _2 : '').trim();
                const body = ((_3 = this.getNodeParameter('body', i)) !== null && _3 !== void 0 ? _3 : '').trim();
                const pixPayment = this.getNodeParameter('pixPayment', i) || {};
                const merchantName = ((_4 = pixPayment.merchantName) !== null && _4 !== void 0 ? _4 : '').trim();
                const key = ((_5 = pixPayment.key) !== null && _5 !== void 0 ? _5 : '').trim();
                const keyType = ((_6 = pixPayment.keyType) !== null && _6 !== void 0 ? _6 : '').trim();
                if (!title)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Title is required');
                if (!body)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Body is required');
                if (!merchantName)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Merchant Name is required');
                if (!key)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Key is required');
                if (!keyType)
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Key Type is required');
                const payload = {
                    Phone: phone,
                    Title: title,
                    Body: body,
                    Buttons: [
                        {
                            PixPayment: {
                                MerchantName: merchantName,
                                Key: key,
                                KeyType: keyType,
                            },
                        },
                    ],
                };
                const response = await post('/chat/send/buttons', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendDocument') {
                const phone = this.getNodeParameter('phone', i);
                const document = this.getNodeParameter('document', i);
                const fileName = this.getNodeParameter('fileName', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                const payload = {
                    Phone: phone,
                    Document: document,
                    FileName: fileName,
                };
                if (extra.id)
                    payload.Id = extra.id;
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/document', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendVideo') {
                const phone = this.getNodeParameter('phone', i);
                const video = this.getNodeParameter('video', i);
                const caption = this.getNodeParameter('caption', i);
                const id = this.getNodeParameter('id', i);
                const jpegThumbnail = this.getNodeParameter('jpegThumbnail', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                const payload = {
                    Phone: phone,
                    Video: video,
                    Caption: caption,
                    Id: id,
                    JpegThumbnail: jpegThumbnail,
                };
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/video', payload);
                returnData.push({ json: response });
                continue;
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
        }
        return [returnData];
    }
}
exports.Kirago = Kirago;
//# sourceMappingURL=Kirago.node.js.map