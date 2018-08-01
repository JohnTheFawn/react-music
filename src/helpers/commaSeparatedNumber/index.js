const CommaSeparatedNumber = (value) => {
  return value.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default CommaSeparatedNumber;
