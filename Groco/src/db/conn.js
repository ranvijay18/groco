const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://ranvijay18:<2580@Ranvi>@cluster0.wwkw8x3.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  ) 
  .then(() => {
     console.log("Mongo db is connected");
  })
  .catch((err) => {
    console.log(err);
  });
