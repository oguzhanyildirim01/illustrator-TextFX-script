app.executeMenuCommand('outline');

var RGBColorDark = new RGBColor(); var RGBColorWhite = new RGBColor();
RGBColorDark.red = 17; RGBColorDark.green = 23; RGBColorDark.blue = 36;
RGBColorWhite.red = 255; RGBColorWhite.green = 255; RGBColorWhite.blue = 255;
var mySelection = app.activeDocument.selection;
var widthObject;
var depth;
var distance;
var offset01; var offset02;
var innerShadow;
var _continue = true;
var myGroup01 = app.activeDocument.groupItems.add();
var myGroup02 = app.activeDocument.groupItems.add();

var win = new Window("dialog", "Enter Values");
var fieldsGroup = win.add("group");
fieldsGroup.orientation = "column";
fieldsGroup.alignChildren = ["left", "center"];

var firstRow = fieldsGroup.add("group");
firstRow.orientation = "row";
firstRow.alignChildren = ["left", "center"];

var depthLabel = firstRow.add("statictext", undefined, "Depth:");
depthLabel.preferredSize.width = 90;
var inputDepth = firstRow.add("edittext", undefined, "25");
inputDepth.alignment = ["fill", "center"];
inputDepth.size = [80, 30];

var offsetLabel = firstRow.add("statictext", undefined, "Text Offset:");
offsetLabel.preferredSize.width = depthLabel.preferredSize.width;
var inputOffset01 = firstRow.add("edittext", undefined, "5");
inputOffset01.alignment = ["fill", "center"];
inputOffset01.size = [80, 30];

var secondRow = fieldsGroup.add("group");
secondRow.orientation = "row";
secondRow.alignChildren = ["left", "center"];

var outlineLabel = secondRow.add("statictext", undefined, "Outline:");
outlineLabel.preferredSize.width = depthLabel.preferredSize.width;
var inputOffset02 = secondRow.add("edittext", undefined, "5");
inputOffset02.alignment = ["fill", "center"];
inputOffset02.size = [80, 30];

var innerShadowLabel = secondRow.add("statictext", undefined, "Inner Shadow:");
innerShadowLabel.preferredSize.width = depthLabel.preferredSize.width;
var inputInnerShadow = secondRow.add("edittext", undefined, "2");
inputInnerShadow.alignment = ["fill", "center"];
inputInnerShadow.size = [80, 30];

var thirdRow = fieldsGroup.add("group");
thirdRow.orientation = "row";
thirdRow.alignChildren = ["left", "center"];

var directionLabel = thirdRow.add("statictext", undefined, "Direction:");
directionLabel.preferredSize.width = depthLabel.preferredSize.width;

var dropdownItems = ["CENTER", "BOTTOM", "BOTTOMLEFT", "BOTTOMRIGHT", "TOP"];
var dropdown = thirdRow.add("dropdownlist", undefined, dropdownItems);
dropdown.selection = 1;

var buttonGroup = win.add("group");
buttonGroup.orientation = "row";
buttonGroup.alignChildren = ["center", "bottom"];

var submitBtn = buttonGroup.add("button", undefined, "Ok");
submitBtn.size = [150, 40];
submitBtn.onClick = function() {
    depth = inputDepth.text;
    offset01 = inputOffset01.text;
    offset02 = inputOffset02.text;
    innerShadow = inputInnerShadow.text;
    win.close();
};

var cancelBtn = buttonGroup.add("button", undefined, "Cancel");
cancelBtn.size = [150, 40];
cancelBtn.onClick = function() {
    _continue = false;
    win.close();
};

win.show();

if(_continue)
{
    logoFX();
}

function logoFX()
{
for (var i = 0; i < mySelection.length; i++) {
    mySelection[i].moveToEnd(myGroup01);
}

var myDuplicate = myGroup01.duplicate();
widthObject = myDuplicate.width;
distance = (widthObject/300);

app.activeDocument.selection = [myDuplicate];
myDuplicate.moveToEnd(myGroup02);

for (var i = 0; i < depth; i++) {
    app.activeDocument.selection[0].zOrder(ZOrderMethod.SENDTOBACK);
    var newObject = myDuplicate.duplicate();
     newObject.top += (i + 1) * -distance;
    var testPos = Transformation[dropdown.selection.text];
    newObject.resize(100 - i,100 - i, true, true, true, true, 0, testPos);
    newObject.moveToEnd(myGroup02);
}
app.activeDocument.selection = [myGroup02];
offsetPath(RGBColorDark , offset01);

myGroup01.zOrder(ZOrderMethod.BRINGTOFRONT);
var copyItem = app.selection[0].duplicate();
copyItem.zOrder(ZOrderMethod.SENDTOBACK);
app.activeDocument.selection = null;
copyItem.selected = true;
offsetPath(RGBColorWhite , offset02);
innerShadowF();
}

function innerShadowF()
{
    var compound01 = myGroup01.duplicate();
    for (var i = 0; i < compound01.pageItems.length; i++) {
        compound01.pageItems[i].fillColor = RGBColorWhite;
    }

    app.activeDocument.selection = null;
    compound01.selected = true;
    app.executeMenuCommand ('compoundPath');

    var compound02 = compound01.duplicate();
    compound02.top += -innerShadow;

    app.activeDocument.selection = null;
    compound01.selected = true;
    compound02.selected = true;
    app.executeMenuCommand("group");
    app.executeMenuCommand ('Live Pathfinder Subtract');
    app.executeMenuCommand("expandStyle");
    app.activeDocument.selection[0].opacity = 90;
    app.activeDocument.selection[0].blendingMode = BlendModes.OVERLAY;
    app.activeDocument.defaultFillColor = RGBColorWhite;
}

function offsetPath(_color, _offset)
{
    app.executeMenuCommand('Live Pathfinder Add');
    app.executeMenuCommand ('expandStyle');
    var xmlstring = '<LiveEffect name="Adobe Offset Path"><Dict data="R mlim 4 R ofst ' + _offset + ' I jntp 0 "/></LiveEffect>';
    app.selection[0].applyEffect(xmlstring);
    app.executeMenuCommand ('Live Outline Stroke');
    app.executeMenuCommand ('expandStyle');
    app.executeMenuCommand('Live Pathfinder Add');
    app.executeMenuCommand('noCompoundPath');
    app.executeMenuCommand ('expandStyle');
    app.selection[0].opacity = 100;  
    app.activeDocument.defaultFillColor = _color;
}