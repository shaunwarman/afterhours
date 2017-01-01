module.exports = {
  main: (callback) => {
    console.log('sample called - not finished');
    setTimeout(() => {
      console.log('sample called after 1s!');
      callback();
    }, 1000);
  }
}
