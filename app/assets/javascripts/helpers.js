// Check if an array of strings contains an instance of another string
function arrayHasString (str, strLst) {
  var containsStr = false;

  for (var i=0; i < strLst.length; i++) {
    if (strLst[i].toLowerCase().indexOf(str.toLowerCase()) !== -1) {
      containsStr = true;
    }
  }

  return containsStr;
}

// Check if every string in the first list is contained in the second
function arrayHasAllStrings (strLst1, strLst2) {
  var hasAllStrings = true;

  for (var i=0; i<strLst1.length; i++) {
    if (!arrayHasString(strLst1[i], strLst2)) {
      hasAllStrings = false;
    }
  }

  return hasAllStrings;
}