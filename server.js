const express = require ('express');
const app = express();
const port = 5000;

app.use(express.json());



const start = 1;
const end = 15;
const rules = { "3": "Fizz", "6": "Buzz" };



/////////////// fun tạo chuỗi mới để xuất ra kết quả
function HamTaoMang(start, end, rules){
  return Array.from({length: end - start + 1}, (_, index) =>
  {
    let i = start+index;
    return Object.entries(rules).reduce((output ,[key,value]) =>{
      return i % key === 0 ? output + value : output;
    }, '') || i.toString();
  })
}


/////////////// fun kiểm tra số nào trả về kết quả FizzBuzz
function KiemTraFizzBuzz(number, rules) {
  return Object.entries(rules).reduce((output, [key, value]) => {
    return number % key === 0 ? output + value : output;
  }, '') || number.toString();
}




/////////// api lấy dữ liệu
app.get('/fizzbuzz', (req, res) => {
  if (start > end) {
    return res.status(400).json({
      error: 'Invalid parameters',
      message: "'The 'end' parameter must be greater than the 'start' parameter."
    });
  }
  const result = HamTaoMang(start, end, rules);
  res.json({
    start,
    end,
    rules,
    result
});
})



/////// api thêm dữ liệu mới
app.post('/fizzbuzz', (req, res) => {
  const { start, end, rules } = req.body;
  if (typeof start !== 'number' || typeof end !== 'number' || typeof rules !== 'object' || Object.keys(rules).length === 0) {
    return res.status(400).json({
      error: 'Validation error',
      message: "'rules' must be a non-empty object with numeric keys."
    });
  }
  for (const key in rules) {
    if (isNaN(key)) {
      return res.status(400).json({
        error: 'Validation error',
        message: "'rules' keys must be numeric."
      });
    }
  }
  const result = HamTaoMang(start, end, rules);
  res.status(200).json({
    start,
    end,
    rules,
    result
  });
});


//// api kiểm tra số dạng FizzBuzz
app.get('/fizzbuzz/:number', (req, res) => {
  const { number } = req.params;
  if (number === 'rules') {
    return res.status(200).json({
      rules
    });
  }
  if (isNaN(number)) {
    return res.status(404).json({
      error: "Number not found",
      message: "Invalid input number."
    });
  }
  const result = KiemTraFizzBuzz(Number(number), rules);
  res.status(200).json({
    number: Number(number),
    rules,
    result
  });
});





app.get('/', (req, res) => {
  res.send('Hello Lâm')
})

app.listen(port,()=>{
  console.log(`Sever running on port: ${port}`)
})