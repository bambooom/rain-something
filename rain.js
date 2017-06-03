/*
 * Created by bambooom on Fri Jun 02 2017
 */

const canvas = document.getElementById('rain-something');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const AG = 9.81; // Acceleration of gravity
let raf;

const MODE = {
    RAIN: 'RAIN', // rainning mode, just vertical drop
    SNOOKER: 'SNOOKER', // like snooker, with boundary and rebound
};

// emoji unicode point
// extracted from http://www.unicode.org/Public/UNIDATA/EmojiSources.txt
// removed 2002/2003/2005 since it seems that they are not printable
const EMOJI_CHAR = ["0023 20E3", "0030 20E3", "0031 20E3", "0032 20E3", "0033 20E3", "0034 20E3", "0035 20E3", "0036 20E3", "0037 20E3", "0038 20E3", "0039 20E3", "00A9", "00AE", "203C", "2049", "2122", "2139", "2194", "2195", "2196", "2197", "2198", "2199", "21A9", "21AA", "231A", "231B", "23E9", "23EA", "23EB", "23EC", "23F0", "23F3", "24C2", "25AA", "25AB", "25B6", "25C0", "25FB", "25FC", "25FD", "25FE", "2600", "2601", "260E", "2611", "2614", "2615", "261D", "263A", "2648", "2649", "264A", "264B", "264C", "264D", "264E", "264F", "2650", "2651", "2652", "2653", "2660", "2663", "2665", "2666", "2668", "267B", "267F", "2693", "26A0", "26A1", "26AA", "26AB", "26BD", "26BE", "26C4", "26C5", "26CE", "26D4", "26EA", "26F2", "26F3", "26F5", "26FA", "26FD", "2702", "2705", "2708", "2709", "270A", "270B", "270C", "270F", "2712", "2714", "2716", "2728", "2733", "2734", "2744", "2747", "274C", "274E", "2753", "2754", "2755", "2757", "2764", "2795", "2796", "2797", "27A1", "27B0", "2934", "2935", "2B05", "2B06", "2B07", "2B1B", "2B1C", "2B50", "2B55", "3030", "303D", "3297", "3299", "1F004", "1F0CF", "1F170", "1F171", "1F17E", "1F17F", "1F18E", "1F191", "1F192", "1F193", "1F194", "1F195", "1F196", "1F197", "1F198", "1F199", "1F19A", "1F1E8 1F1F3", "1F1E9 1F1EA", "1F1EA 1F1F8", "1F1EB 1F1F7", "1F1EC 1F1E7", "1F1EE 1F1F9", "1F1EF 1F1F5", "1F1F0 1F1F7", "1F1F7 1F1FA", "1F1FA 1F1F8", "1F201", "1F202", "1F21A", "1F22F", "1F232", "1F233", "1F234", "1F235", "1F236", "1F237", "1F238", "1F239", "1F23A", "1F250", "1F251", "1F300", "1F301", "1F302", "1F303", "1F304", "1F305", "1F306", "1F307", "1F308", "1F309", "1F30A", "1F30B", "1F30C", "1F30F", "1F311", "1F313", "1F314", "1F315", "1F319", "1F31B", "1F31F", "1F320", "1F330", "1F331", "1F334", "1F335", "1F337", "1F338", "1F339", "1F33A", "1F33B", "1F33C", "1F33D", "1F33E", "1F33F", "1F340", "1F341", "1F342", "1F343", "1F344", "1F345", "1F346", "1F347", "1F348", "1F349", "1F34A", "1F34C", "1F34D", "1F34E", "1F34F", "1F351", "1F352", "1F353", "1F354", "1F355", "1F356", "1F357", "1F358", "1F359", "1F35A", "1F35B", "1F35C", "1F35D", "1F35E", "1F35F", "1F360", "1F361", "1F362", "1F363", "1F364", "1F365", "1F366", "1F367", "1F368", "1F369", "1F36A", "1F36B", "1F36C", "1F36D", "1F36E", "1F36F", "1F370", "1F371", "1F372", "1F373", "1F374", "1F375", "1F376", "1F377", "1F378", "1F379", "1F37A", "1F37B", "1F380", "1F381", "1F382", "1F383", "1F384", "1F385", "1F386", "1F387", "1F388", "1F389", "1F38A", "1F38B", "1F38C", "1F38D", "1F38E", "1F38F", "1F390", "1F391", "1F392", "1F393", "1F3A0", "1F3A1", "1F3A2", "1F3A3", "1F3A4", "1F3A5", "1F3A6", "1F3A7", "1F3A8", "1F3A9", "1F3AA", "1F3AB", "1F3AC", "1F3AD", "1F3AE", "1F3AF", "1F3B0", "1F3B1", "1F3B2", "1F3B3", "1F3B4", "1F3B5", "1F3B6", "1F3B7", "1F3B8", "1F3B9", "1F3BA", "1F3BB", "1F3BC", "1F3BD", "1F3BE", "1F3BF", "1F3C0", "1F3C1", "1F3C2", "1F3C3", "1F3C4", "1F3C6", "1F3C8", "1F3CA", "1F3E0", "1F3E1", "1F3E2", "1F3E3", "1F3E5", "1F3E6", "1F3E7", "1F3E8", "1F3E9", "1F3EA", "1F3EB", "1F3EC", "1F3ED", "1F3EE", "1F3EF", "1F3F0", "1F40C", "1F40D", "1F40E", "1F411", "1F412", "1F414", "1F417", "1F418", "1F419", "1F41A", "1F41B", "1F41C", "1F41D", "1F41E", "1F41F", "1F420", "1F421", "1F422", "1F423", "1F424", "1F425", "1F426", "1F427", "1F428", "1F429", "1F42B", "1F42C", "1F42D", "1F42E", "1F42F", "1F430", "1F431", "1F432", "1F433", "1F434", "1F435", "1F436", "1F437", "1F438", "1F439", "1F43A", "1F43B", "1F43C", "1F43D", "1F43E", "1F440", "1F442", "1F443", "1F444", "1F445", "1F446", "1F447", "1F448", "1F449", "1F44A", "1F44B", "1F44C", "1F44D", "1F44E", "1F44F", "1F450", "1F451", "1F452", "1F453", "1F454", "1F455", "1F456", "1F457", "1F458", "1F459", "1F45A", "1F45B", "1F45C", "1F45D", "1F45E", "1F45F", "1F460", "1F461", "1F462", "1F463", "1F464", "1F466", "1F467", "1F468", "1F469", "1F46A", "1F46B", "1F46E", "1F46F", "1F470", "1F471", "1F472", "1F473", "1F474", "1F475", "1F476", "1F477", "1F478", "1F479", "1F47A", "1F47B", "1F47C", "1F47D", "1F47E", "1F47F", "1F480", "1F481", "1F482", "1F483", "1F484", "1F485", "1F486", "1F487", "1F488", "1F489", "1F48A", "1F48B", "1F48C", "1F48D", "1F48E", "1F48F", "1F490", "1F491", "1F492", "1F493", "1F494", "1F495", "1F496", "1F497", "1F498", "1F499", "1F49A", "1F49B", "1F49C", "1F49D", "1F49E", "1F49F", "1F4A0", "1F4A1", "1F4A2", "1F4A3", "1F4A4", "1F4A5", "1F4A6", "1F4A7", "1F4A8", "1F4A9", "1F4AA", "1F4AB", "1F4AC", "1F4AE", "1F4AF", "1F4B0", "1F4B1", "1F4B2", "1F4B3", "1F4B4", "1F4B5", "1F4B8", "1F4B9", "1F4BA", "1F4BB", "1F4BC", "1F4BD", "1F4BE", "1F4BF", "1F4C0", "1F4C1", "1F4C2", "1F4C3", "1F4C4", "1F4C5", "1F4C6", "1F4C7", "1F4C8", "1F4C9", "1F4CA", "1F4CB", "1F4CC", "1F4CD", "1F4CE", "1F4CF", "1F4D0", "1F4D1", "1F4D2", "1F4D3", "1F4D4", "1F4D5", "1F4D6", "1F4D7", "1F4D8", "1F4D9", "1F4DA", "1F4DB", "1F4DC", "1F4DD", "1F4DE", "1F4DF", "1F4E0", "1F4E1", "1F4E2", "1F4E3", "1F4E4", "1F4E5", "1F4E6", "1F4E7", "1F4E8", "1F4E9", "1F4EA", "1F4EB", "1F4EE", "1F4F0", "1F4F1", "1F4F2", "1F4F3", "1F4F4", "1F4F6", "1F4F7", "1F4F9", "1F4FA", "1F4FB", "1F4FC", "1F503", "1F50A", "1F50B", "1F50C", "1F50D", "1F50E", "1F50F", "1F510", "1F511", "1F512", "1F513", "1F514", "1F516", "1F517", "1F518", "1F519", "1F51A", "1F51B", "1F51C", "1F51D", "1F51E", "1F51F", "1F520", "1F521", "1F522", "1F523", "1F524", "1F525", "1F526", "1F527", "1F528", "1F529", "1F52A", "1F52B", "1F52E", "1F52F", "1F530", "1F531", "1F532", "1F533", "1F534", "1F535", "1F536", "1F537", "1F538", "1F539", "1F53A", "1F53B", "1F53C", "1F53D", "1F550", "1F551", "1F552", "1F553", "1F554", "1F555", "1F556", "1F557", "1F558", "1F559", "1F55A", "1F55B", "1F5FB", "1F5FC", "1F5FD", "1F5FE", "1F5FF", "1F601", "1F602", "1F603", "1F604", "1F605", "1F606", "1F609", "1F60A", "1F60B", "1F60C", "1F60D", "1F60F", "1F612", "1F613", "1F614", "1F616", "1F618", "1F61A", "1F61C", "1F61D", "1F61E", "1F620", "1F621", "1F622", "1F623", "1F624", "1F625", "1F628", "1F629", "1F62A", "1F62B", "1F62D", "1F630", "1F631", "1F632", "1F633", "1F635", "1F637", "1F638", "1F639", "1F63A", "1F63B", "1F63C", "1F63D", "1F63E", "1F63F", "1F640", "1F645", "1F646", "1F647", "1F648", "1F649", "1F64A", "1F64B", "1F64C", "1F64D", "1F64E", "1F64F", "1F680", "1F683", "1F684", "1F685", "1F687", "1F689", "1F68C", "1F68F", "1F691", "1F692", "1F693", "1F695", "1F697", "1F699", "1F69A", "1F6A2", "1F6A4", "1F6A5", "1F6A7", "1F6A8", "1F6A9", "1F6AA", "1F6AB", "1F6AC", "1F6AD", "1F6B2", "1F6B6", "1F6B9", "1F6BA", "1F6BB", "1F6BC", "1F6BD", "1F6BE", "1F6C0"];

/**
 * copy from https://github.com/notwaldorf/emoji-rain, which is
 * lifted from https://github.com/twitter/twemoji
 * returns the emoji for a codepoint.
 */

function fromCodePoint(codePoint) {
    let code = typeof codePoint === 'string' ?
        parseInt(codePoint, 16) : codePoint;
    if (code < 0x10000) {
        return String.fromCharCode(code);
    }
    code -= 0x10000;
    return String.fromCharCode(
        0xD800 + (code >> 10),
        0xDC00 + (code & 0x3FF)
    );
}

class RainDrop {
    constructor(emoji, maxHeight = canvas.height, maxWidth = canvas.width, maxVelocity = 5, mode = MODE.RAIN) {
        this.text = emoji;
        this.x = Math.random() * maxWidth;
        this.y = Math.random() * maxHeight;
        this.vx = mode === MODE.RAIN ? 0 : Math.random() * maxVelocity;
        this.vy = mode === MODE.RAIN ? AG : Math.random() * maxVelocity;
        this.font = '18px serif';
        // this.color = '#fff';
    }

    drawDrop(ctx) {
        ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y);
        // ctx.fillStyle = this.color;
    }

    move(maxHeight, maxWidth) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > maxWidth || this.y > maxHeight) {
            this.x = Math.random() * maxWidth;
            this.y = -20;
        }
        // console.log(maxHeight, maxWidth);
        // this.vy *= 0.99;
        // this.vy += 0.25;

        // // boundary
        // if (this.y + this.vy > maxHeight ||
        //     this.y + this.vy < 0) {
        //     this.vy = -this.vy * 0.99;
        // }
        // if (this.x + this.vx > maxWidth ||
        //     this.x + this.vx < 0) {
        //     this.vx = -this.vx * 0.99;
        // }
    }
}

const maxDrops = 100;
const drops = [];

for (let i = 0; i < maxDrops; i++) {
    drops.push(new RainDrop('🙄'));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < maxDrops; i++) {
        drops[i].drawDrop(ctx);
        drops[i].move(canvas.height, canvas.width);
    }

    // window.requestAnimationFrame(draw);
}

// window.requestAnimationFrame(draw);
setInterval(draw, 50);
window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});
// canvas.addEventListener('mouseover', function(e) {
//     raf = window.requestAnimationFrame(draw);
// });

// canvas.addEventListener('mouseout', function(e) {
//     window.cancelAnimationFrame(raf);
// });