//this whole little web app reminds me of MS ACCESS creating UI layouts


document.getElementById("rightBtn").style.backgroundColor = "#2471A3";
var _counter = 1; // keeping track of how many elements are added
var _counterForms = 0; // keeping track of index at which new elements are saved in array
var _counterFormsBool = false;
var _temp = true; //used for checking if form(template) has been found in database
var _newForm = []; //temp array for saving the latest form template
var _formTracker = [];
var _counterFormTracker = 0;

const tabClick = _clickedID => {
  // toggling between the two tabs in our application

  var _tabContent;
  if (_clickedID === "leftBtn") {
    document.getElementById("rightBtn").style.backgroundColor = "#2471A3";
    document.getElementById("leftBtn").style.backgroundColor = "#ADC4CC";
    _tabContent = document.getElementById("tabContentForm");
    _tabContent.style.display = "none";
    _tabContent = document.getElementById("tabContentAdmin");
    _tabContent.style.display = "block";
    revertUpdateFormList();
  } else if (_clickedID === "rightBtn") {
    document.getElementById("leftBtn").style.backgroundColor = "#2471A3";
    document.getElementById("rightBtn").style.backgroundColor = "#ADC4CC";
    _tabContent = document.getElementById("tabContentAdmin");
    _tabContent.style.display = "none";
    _tabContent = document.getElementById("tabContentForm");
    _tabContent.style.display = "block";
    updateFormList();
  }
};

const newLine = () => {
  if (_counter < 9) {
    var _newLine =
      '<br> <p id="paragraphAdmin' +
      _counter +
      '" class="searchField">Element ' +
      _counter +
      ' </p> <input type="text" class="searchField"' +
      ' id="Label' +
      _counter +
      '" value="Label ' +
      _counter +
      '">' +
      '<pre class="searchField">   </pre>' +
      '<select class="searchField"' +
      'id="selectFirst' +
      _counter +
      '" name="componentList" onclick="updateRadio(' +
      _counter +
      ')">' +
      '<option value="text" onclick="updateRadioClear(' +
      _counter +
      ')">Textbox</option>' +
      '<option value="checkbox" onclick="updateRadioClear(' +
      _counter +
      ')">Check Box</option>' +
      '<option value="radio">Radio Buttons</option>' +
      "</select>" +
      '<pre class="searchField">   </pre>' +
      '<select class="searchField"' +
      'id="selectSecond' +
      _counter +
      '" name="required">' +
      '<option value="nonmandatory">Non Mandatory</option>' +
      '<option value="mandatory">Mandatory</option>' +
      '<option value="numeric">Numeric</option>' +
      "</select>" +
      '<pre class="searchField">   </pre>' +
      '<input type="button" value="+" class="plusButton" id="plusBtn' +
      _counter +
      '"  onclick="newLine()">';

    if (!_counterFormsBool) {
      _newForm[_counterForms] = _newLine;
      _counterForms += 1;
    }

    var _elem = document.getElementById("newElementsAdmin");
    _elem.innerHTML += _newLine;
    _counter += 1;
  }

  if (_counter > 8) {
    alert("Not advisable to add more than 8 elements.");
  }

  selectedIndexStay(); // makes sure dropdown stays selected after inevitable refreshing div due to innerHTML
};
const adminPageNewForm = () => {
  //adding new elements

  var _newLine =
    '<br> <p id="paragraphAdmin' +
    _counter +
    '" class="searchField">Element ' +
    _counter +
    ' </p> <input type="text" class="searchField"' +
    ' id="Label' +
    _counter +
    '" value="Label ' +
    _counter +
    '">' +
    '<pre class="searchField">   </pre>' +
    '<select class="searchField"' +
    'id="selectFirst' +
    _counter +
    '" name="componentList" onclick="updateRadio(' +
    _counter +
    ')">' +
    '<option value="text" onclick="updateRadioClear(' +
    _counter +
    ')">Textbox</option>' +
    '<option value="checkbox" onclick="updateRadioClear(' +
    _counter +
    ')">Check Box</option>' +
    '<option value="radio">Radio Buttons</option>' +
    "</select>" +
    '<pre class="searchField">   </pre>' +
    '<select class="searchField"' +
    'id="selectSecond' +
    _counter +
    '" name="required">' +
    '<option value="nonmandatory">Non Mandatory</option>' +
    '<option value="mandatory">Mandatory</option>' +
    '<option value="numeric">Numeric</option>' +
    "</select>" +
    '<pre class="searchField">   </pre>' +
    '<input type="button" value="+" class="plusButton" id="plusBtn' +
    _counter +
    '" onclick="newLine()">';

  if (!_counterFormsBool) {
    _newForm[_counterForms] = _newLine;
    _counterForms += 1;
  }
  var _saveResetInsert =
    '<input type="button" value="SAVE" id="saveButton" onclick="saveNewForm()"><input type="button" value="CLEAR" id="clearButton" onclick="clearForm()">';
  document.getElementById("saveAndResetButtons").innerHTML = _saveResetInsert;

  var _elem = document.getElementById("newElementsAdmin");
  _elem.innerHTML += _newLine;
  _temp = false;
  _counter += 1;
};

const clearForm = () => {
  document.getElementById("newElementsAdmin").innerHTML = "";
  _temp = true;
  _counter = 1;
};

const saveNewForm = () => {
  //saving new form to localStorage under a unique key, or overwriting an already existing one

  var _example = document.getElementById("searchAdmin").value;
  _example += "(example)";
  var _formName = prompt("Please enter a name for your form", _example);

  var _tamperedForm = document.getElementById("newElementsAdmin").innerHTML;

  if (localStorage.getItem(_formName) === null) {
    _formName = _formName.replace("(example)", "");
    localStorage.setItem(_formName, _tamperedForm);
  } else {
    if (
      confirm(
        "A form with this name already exists, pls choose another name or press YES to overwrite current form (!)"
      )
    ) {
      _formName = _formName.replace("(example)", "");
      localStorage.setItem(_formName, _tamperedForm);
    } else {
      _formName = prompt(
        "Please enter a name for your new form (Be aware if you enter the same way the form template WILL be overwritten!",
        "Janes form (example)"
      );
      _formName = _formName.replace("(example)", "");
      localStorage.setItem(_formName, _tamperedForm);
    }
  }

  additionalDataSaveNewForm(_formName);
};

const additionalDataSaveNewForm = _formName => {
  var _dropdownSelected;
  var _savedData = [];
  var _savedRadio = [];
  var x, _objHelper;
  selectedIndexStay();

  var _radioObj = {
    row1: "",
    row2: "",
    row3: "",
    row4: "",
    row5: "",
    row6: "",
    row7: "",
    row8: "",
    row9: ""
  };

  for (var i = 1; i < howManyElements() + 1; i++) {
    _dropdownSelected = document.getElementById("Label" + i).value;
    _savedData.push(_dropdownSelected);

    _dropdownSelected = document.getElementById("selectFirst" + i);
    _dropdownSelected =
      _dropdownSelected.options[_dropdownSelected.selectedIndex].value;
    _savedData.push(_dropdownSelected);

    if (_dropdownSelected == "radio") {
      _objHelper = "row" + i;

      x = document.getElementById("radioChosen" + i + "_radioChosenLabel1");
      if (x != null) {
        _radioObj[_objHelper] += x.value;
      }

      x = document.getElementById("radioChosen" + i + "_radioChosenLabel2");
      if (x != null) {
        _radioObj[_objHelper] += " , " + x.value;
      }

      x = document.getElementById("radioChosen" + i + "_radioChosenLabel3");
      if (x != null) {
        _radioObj[_objHelper] += " , " + x.value;
      }
    }

    _dropdownSelected = document.getElementById("selectSecond" + i);
    _dropdownSelected =
      _dropdownSelected.options[_dropdownSelected.selectedIndex].value;
    _savedData.push(_dropdownSelected);
  }

  localStorage.setItem(_formName + "(_savedData)", _savedData);
  localStorage.setItem(_formName + "(_savedRadio)", JSON.stringify(_radioObj));
};

const howManyElements = () => {
  var y;
  var _helperCounter = 0;
  for (var i = 0; i < 10; i++) {
    y = document.getElementById("Label" + i);
    if (y != null) {
      _helperCounter += 1;
    }
  }

  return _helperCounter;
};
const loadForm = () => {
  //loading form selected from dropdown list

  var _drawHelper;
  var _drawHelperRadio;
  var _dropdownSelected = document.getElementById("dropdownForms");
  var _formToLoad =
    _dropdownSelected.options[_dropdownSelected.selectedIndex].value;
  var _insert = "";
  var _loopCounter = 1;
  var x_mand = []; //used for validation, required
  var x_num = []; //user for validation, numerical
  var _elem = document.getElementById("newElementsForm");

  //_elem.innerHTML=localStorage.getItem(_formToLoad);

  _drawHelperRadio = _formToLoad + "(_savedRadio)";
  _formToLoad += "(_savedData)";
  _drawHelper = localStorage.getItem(_formToLoad);
  _drawHelper = _drawHelper.split(","); //_savedData array
  _drawHelperRadio = JSON.parse(localStorage.getItem(_drawHelperRadio));
  //_drawHelperRadio=_drawHelperRadio.split(",");
  /*
		var ancestor = document.getElementById('newElementsForm');
    	var descendents = ancestor.getElementsByTagName('*');
    	descendents = Array.prototype.slice.call(descendents);

			    var i, e, d;
				for (i = 0; i < descendents.length; ++i) {
			   		e=descendents[i];
			    }
*/

  var i = 0;
  do {
    _insert += '<p class="searchFieldX">' + _drawHelper[i] + "</p>";
    i += 1;

    switch (_drawHelper[i]) {
      case "text":
        _insert +=
          '<input type="text" id="inputText' +
          (i + 1) +
          '" class="searchField" value=""><br>';
        break;
      case "checkbox":
        _insert +=
          '<input type="checkbox" id="checkbox' +
          (i + 1) +
          '" class="searchFieldCheckBox" value=""><br>';
        break;
      case "radio":
        _insert += drawRadio(_loopCounter, _drawHelperRadio);
        break;
    }

    _loopCounter += 1;
    i += 1;

    switch (_drawHelper[i]) {
      case "mandatory":
        {
          x_mand.push("inputText" + i);
        }
        break;
      case "nonmandatory":
        break;
      case "numeric":
        x_num.push("inputText" + i);
        break;
    }

    i += 1;
  } while (i < _drawHelper.length);

  _elem.innerHTML = _insert;

  updateValidation(x_num, x_mand);
  _dropdownSelected =
    _dropdownSelected.options[_dropdownSelected.selectedIndex].value;
  updateDataInput(_dropdownSelected);
};

const updateValidation = (x_num, x_mand) => {
  if (x_num.length > 0) {
    var _helem;
    for (var i = 0; i < x_num.length; i++) {
      _helem = document.getElementById(x_num[i]);
      if (_helem != null) {
        _helem.type = "number"; // allows only numerical input
      }
    }
  }

  if (x_mand.length > 0) {
    var _helem;
    for (var i = 0; i < x_mand.length; i++) {
      _helem = document.getElementById(x_mand[i]);
      if (_helem != null) {
        _helem.setAttribute("required", ""); //turns required on
        _helem.required = true;
      }
    }
  }
};

const drawRadio = (_loopCounter, _drawHelperRadio) => {
  var _insert = '<br><form id="formRadio' + _loopCounter + '">';
  var _helper = _drawHelperRadio["row" + _loopCounter];
  _helper = _helper.split(",");

  var x = _helper[0];
  if (x != null) {
    _insert +=
      '<input type="radio" name="radioBtns' +
      _loopCounter +
      '" class="searchFieldFormRadio" value="' +
      _helper[0] +
      '"><p class="parRadio">' +
      _helper[0] +
      "</p><br>";
  }

  var x = _helper[1];
  if (x != null) {
    _insert +=
      '<input type="radio" name="radioBtns' +
      _loopCounter +
      '" class="searchFieldFormRadio" value="' +
      _helper[1] +
      '"><p class="parRadio">' +
      _helper[1] +
      "</p><br>";
  }

  var x = _helper[2];
  if (x != null) {
    _insert +=
      '<input type="radio" name="radioBtns' +
      _loopCounter +
      '" class="searchFieldFormRadio" value="' +
      _helper[2] +
      '"><p class="parRadio">' +
      _helper[2] +
      "</p><br>";
  }

  _insert += "</form>";
  return _insert;
};

const updateRadio = _elem => {
  //if radio option selected update view accordingly

  var _tempElem = _elem;
  _elem = "selectFirst" + _elem;
  var _newLine;

  var _dropdownSelected = document.getElementById(_elem);
  _dropdownSelected =
    _dropdownSelected.options[_dropdownSelected.selectedIndex].value;

  if (_dropdownSelected == "radio") {
    _newLine =
      '<select class="chooseRadio" id="radioChosen' +
      _tempElem +
      '" onclick="updateRadioQuant(' +
      _tempElem +
      ')">' +
      '<option value="1">1</option>' +
      '<option value="2">2</option>' +
      '<option value="3">3</option>' +
      "</select>";

    var x = document.getElementById("radioChosen" + _tempElem);
    if (x != null) {
      document.getElementById("radioChosen" + _tempElem).outerHTML = "";
    }

    _elem = document.getElementById(_elem);
    _elem.insertAdjacentHTML("afterend", _newLine);
  } else {
    updateRadioClear(_tempElem);
  } //if the radio option is deselected, remove it
};

const updateRadioClear = _tempElem => {
  var x = document.getElementById(
    "radioChosen" + _tempElem + "_radioChosenLabel1"
  );
  if (x != null) {
    document.getElementById(
      "radioChosen" + _tempElem + "_radioChosenLabel1"
    ).outerHTML = "";
  }

  x = document.getElementById("radioChosen" + _tempElem + "_radioChosenLabel2");
  if (x != null) {
    document.getElementById(
      "radioChosen" + _tempElem + "_radioChosenLabel2"
    ).outerHTML = "";
  }

  x = document.getElementById("radioChosen" + _tempElem + "_radioChosenLabel3");
  if (x != null) {
    document.getElementById(
      "radioChosen" + _tempElem + "_radioChosenLabel3"
    ).outerHTML = "";
  }

  x = document.getElementById("radioChosen" + _tempElem);
  if (x != null) {
    document.getElementById("radioChosen" + _tempElem).outerHTML = "";
  }
};

const updateRadioQuant = _tempElem => {
  //update the number of radio options, if one changes his mind to expand or decrease

  var _dropdownSelected = document.getElementById("radioChosen" + _tempElem);
  _dropdownSelected =
    _dropdownSelected.options[_dropdownSelected.selectedIndex].value;

  clearRadioLabel(_tempElem); //clears radio labels or updates if necessary

  _dropdownSelected = _dropdownSelected.toString();
  switch (_dropdownSelected) {
    case "1":
      _insert =
        '<input type="text" class="radioLabels" id="radioChosen' +
        _tempElem +
        '_radioChosenLabel1" name="" value="Radio Label 1" >';
      break;
    case "2":
      _insert =
        '<input type="text" class="radioLabels" id="radioChosen' +
        _tempElem +
        '_radioChosenLabel1" name="" value="Radio Label 1" >' +
        '<input type="text" class="radioLabels"  id="radioChosen' +
        _tempElem +
        '_radioChosenLabel2" name="" value="Radio Label 2" >';
      break;
    case "3":
      _insert =
        '<input type="text" class="radioLabels"  id="radioChosen' +
        _tempElem +
        '_radioChosenLabel1" name="" value="Radio Label 1" >' +
        '<input type="text" class="radioLabels"  id="radioChosen' +
        _tempElem +
        '_radioChosenLabel2" name="" value="Radio Label 2" >' +
        '<input type="text" class="radioLabels"  id="radioChosen' +
        _tempElem +
        '_radioChosenLabel3" name="" value="Radio Label 3" >';
      break;
  }

  var _elem = "plusBtn" + _tempElem;
  _elem = document.getElementById(_elem);
  _elem.insertAdjacentHTML("afterend", _insert);
};

const clearRadioLabel = _tempElem => {
  var x = document.getElementById(
    "radioChosen" + _tempElem + "_radioChosenLabel1"
  );
  if (x != null) {
    document.getElementById(
      "radioChosen" + _tempElem + "_radioChosenLabel1"
    ).outerHTML = "";
  }

  x = document.getElementById("radioChosen" + _tempElem + "_radioChosenLabel2");
  if (x != null) {
    document.getElementById(
      "radioChosen" + _tempElem + "_radioChosenLabel2"
    ).outerHTML = "";
  }

  x = document.getElementById("radioChosen" + _tempElem + "_radioChosenLabel3");
  if (x != null) {
    document.getElementById(
      "radioChosen" + _tempElem + "_radioChosenLabel3"
    ).outerHTML = "";
  }
};

const selectedIndexStay = () => {
  var _tempElem;

  for (var i = 1; i < 9; i++) {
    _tempElem = document.getElementById(
      "radioChosen" + i + "_radioChosenLabel1"
    );
    if (_tempElem != null) {
      document.getElementById("selectFirst" + i).selectedIndex = "2";
    }
  }
};

const searchAdmin = () => {
  /*
determining whether a form template under this name (key) already exists or to start from scratch. 
if one exists then loads it up or if not adds one single element on the page (together with a plus button for adding further ones)
*/
  var _searchTerm = document.getElementById("searchAdmin").value;
  if (localStorage.getItem(_searchTerm) === null) {
    clearForm();
    if (_temp) {
      adminPageNewForm();
    }
  } else {
    document.getElementById("newElementsAdmin").innerHTML = "";
    _savedForm = localStorage.getItem(_searchTerm);
    document.getElementById("newElementsAdmin").innerHTML = _savedForm;
    _savedForm = localStorage.getItem(_searchTerm + "(_savedData)");
    _savedForm = _savedForm.split(",").length / 3;
    _counter = _savedForm + 1;
    var _saveResetInsert =
      '<input type="button" value="SAVE" id="saveButton" onclick="saveNewForm()"><input type="button" value="CLEAR" id="clearButton" onclick="clearForm()">';
    document.getElementById("saveAndResetButtons").innerHTML = _saveResetInsert;
  }
};

const updateFormList = () => {
  //adds all known forms in localStorage to dropdown list for selection

  var _keyForm;
  var _tempBool1 = false;
  var _tempbool2 = false;
  var _tempbool3 = false;
  var _tempbool4 = false;
  var _tempbool5 = false;
  var _tempBool6 = false;
  var _substring1 = "(_savedData)";
  var _substring2 = "(_savedRadio)";
  var _substring3 = "(_type)";
  var _substring4 = "(_values)";
  var _substring5 = "(_checked)";
  var _substring6 = "(_version)";

  for (var i = 0, len = localStorage.length; i < len; ++i) {
    _keyForm = localStorage.key(i).replace("(example)", "");

    _tempBool1 = _keyForm.includes(_substring1);
    _tempBool2 = _keyForm.includes(_substring2);
    _tempBool3 = _keyForm.includes(_substring3);
    _tempBool4 = _keyForm.includes(_substring4);
    _tempBool5 = _keyForm.includes(_substring5);
    _tempBool6 = _keyForm.includes(_substring6);

    if (
      !_tempBool1 &&
      !_tempBool2 &&
      !_tempBool3 &&
      !_tempBool4 &&
      !_tempBool5 &&
      !_tempBool6
    ) {
      document.getElementById("dropdownForms").innerHTML +=
        '<option value="' + _keyForm + '">' + _keyForm + "</option>";
    }
  }
  document.getElementById("versionForm").value = "0";
};

const revertUpdateFormList = () => {
  //makes sure the localStorage dropdown list is clean and accurate
  document.getElementById("dropdownForms").innerHTML = "";
};

const saveFormInput = () => {
  //saves our form inputs

  var _dropdownSelected = document.getElementById("dropdownForms");
  var _formToLoad =
    _dropdownSelected.options[_dropdownSelected.selectedIndex].value;
  var x = document
    .getElementById("newElementsForm")
    .getElementsByTagName("input");
  var _type = [];
  var _values = [];
  var _checked = [];
  var _version;
  var _temporaryBool = true;

  for (var i = 0; i < x.length; i++) {
    _type[i] = x.item(i).type;
    _values[i] = x.item(i).value;
    _checked[i] = x.item(i).checked;
    if (x.item(i).required == true && x.item(i).value == "") {
      x.item(i).classList.add("error");
      alert("Element with red border is required!");
      _temporaryBool = false;
    } else if (x.item(i).required == true && x.item(i).value != "") {
      x.item(i).classList.remove("error");
      _temporaryBool = true;
    }
  }

  if (_temporaryBool == true) {
    _version = document.getElementById("versionForm").value;
    localStorage.setItem(_formToLoad + "(_type)", JSON.stringify(_type));
    localStorage.setItem(_formToLoad + "(_values)", JSON.stringify(_values));
    localStorage.setItem(_formToLoad + "(_checked)", JSON.stringify(_checked));
    localStorage.setItem(_formToLoad + "(_version)", JSON.stringify(_version));

    alert("Data succesfully saved");
  }
};

const updateDataInput = _dropdownSelected => {
  var x = document
    .getElementById("newElementsForm")
    .getElementsByTagName("input");

  var _type = JSON.parse(localStorage.getItem(_dropdownSelected + "(_type)"));
  var _values = JSON.parse(
    localStorage.getItem(_dropdownSelected + "(_values)")
  );
  var _checked = JSON.parse(
    localStorage.getItem(_dropdownSelected + "(_checked)")
  );

  for (var i = 0; i < x.length; i++) {
    if (_type[i] == x.item(i).type) {
      if (x.item(i).type == "text") {
        x.item(i).value = _values[i];
      }
      if (x.item(i).type == "radio") {
        x.item(i).checked = _checked[i];
      }
      if (x.item(i).type == "checkbox") {
        x.item(i).checked = _checked[i];
      }
    }
  }

  document.getElementById("versionForm").value = localStorage.getItem(
    _dropdownSelected + "(_version)"
  );
};

document.getElementById("leftBtn").addEventListener("click", tabClick);
document.getElementById("rightBtn").addEventListener("click", tabClick);
