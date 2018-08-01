const ConvertMillisecondsToFriendly = (value) => {

  let milliseconds = value.value;
  let seconds = null;
  let minutes = null;
  let hours   = null;
  let days    = null;
  let weeks   = null;

  if(milliseconds > 1000){
    seconds = Math.floor(milliseconds / 1000);
  }
  if(seconds > 60){
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
  }
  if(minutes > 60){
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
  }
  if(hours > 24){
    days = Math.floor(hours / 24);
    hours = hours % 24;
  }
  if(days > 7){
    weeks = Math.floor(days / 7);
    days = days % 7;
  }

  let displayString = '';
  let fieldsAdded = 0;
  if(weeks !== null && fieldsAdded < 3){
    if(displayString){
      displayString += ' ';
    }
    displayString += weeks + 'w';
    fieldsAdded++;
  }
  if(days !== null && fieldsAdded < 3){
    if(displayString){
      displayString += ' ';
    }
    displayString += days + 'd';
    fieldsAdded++;
  }
  if(hours !== null && fieldsAdded < 3){
    if(displayString){
      displayString += ' ';
    }
    displayString += hours + 'h';
    fieldsAdded++;
  }
  if(minutes !== null && fieldsAdded < 3){
    if(displayString){
      displayString += ' ';
    }
    displayString += minutes + 'm';
    fieldsAdded++;
  }
  if(seconds !== null && fieldsAdded < 3){
    if(displayString){
      displayString += ' ';
    }
    displayString += seconds + 's';
    fieldsAdded++;
  }

  return displayString;
};

export default ConvertMillisecondsToFriendly;
