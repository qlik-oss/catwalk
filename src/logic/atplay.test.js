// const data = require('./sample-data').data;
// const logic = require('./logic');
// const atplay = require('./atplay');

// describe('key tricks', () => {
//   it('should be perfect', () => {
//     function mixColors(color1, color2, weight) {
//       function dec2hex(d) { return d.toString(16); }
//       function hext2dec(h) { return parseInt(h, 16); }

//       let color = '#';
//       for (let i = 1; i <= 6; i += 2) {
//         const v1 = hext2dec(color1.substr(i, 2));
//         // extract the current pairs

//         const v2 = hext2dec(color2.substr(i, 2));

//         console.log(v1, v2);
//         let val = dec2hex(Math.floor(v2 + (v1 - v2) * (weight)));
//         while (val.length < 2) { val = `0${val}`; } // prepend a '0' if val results in a single digit
//         color += val; // concatenate val to our new color string
//       }

//       return color; // PROFIT!
//     }
//     console.log(mixColors('#FF0000', '#FFFF00', 0.5));

//     // const model = new logic.QueryModel(data, "FactTable");
//     //
//     // const m2 = new atplay.AtPlayModel(model, {"OrderID": true, "SegmentDesc": true});
//     //
//     // console.log(m2.keysAtPlay)
//     // console.log(m2.tablesAtPlay)
//   });
// });
