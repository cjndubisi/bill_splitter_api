import app from './server';

var port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Successfully started server at port ${port}`);
});
