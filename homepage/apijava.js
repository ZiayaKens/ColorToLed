

 $(document).ready(function() {
  var orgData = {}
  var brightness =[]          //used to invert the rgb color for because anode LED
  var pictureloaded = false;
  var showinfo = false;       //variable for when to  have the mouse over actually show the info of the colors


  function fill(){                  // this function creatrs an array to help convert the rgb color values for the anode led
    for(let i=0; i<256; i++){
      brightness.push(i)
    }
    brightness.reverse()
  }
  fill();
  //console.log(brightness);

  function button(){        //variation to just creating a variable of the element
    return $('#btn');
  }
  function urlvalue(){
    return $('#url')
  }








  button().click(function(event){
    event.preventDefault();
    var urlsvg = $("#urlsvg");
    var url = urlvalue().val();
    var dots = $(".dots");
    var pic = $("img");

    dots.css({"display": "block"});
    pic.css({"display": "none"});
    urlsvg.addClass("pleasehide");
    $.get('https://g-colortag.herokuapp.com/tag-url.json?palette=simple&sort=relevance&url=' + url, function(data) {

      showinfo = true;
      dots.css({"display": "none"});
      pic.css({"display": ""});
      pictureloaded = true;

      displayImage(url);
      orgData = new Organizedata(data);
      console.log(orgData);
      led(orgData.led[1]);
      displayColors(orgData);//
      });
  });

  function Organizedata(fakedata){
      this.original = [];
      this.led = [];
      this.ledwebpage = [];
      for(let i=0; i<fakedata["tags"].length; i++){
        let hex = [];
        hex.push(fakedata["tags"][i]["color"]);
        hex.push(fakedata["tags"][i]["label"]);
        this.original.push(hex);
      }
      for(var j=0; j<this.original.length; j++){
        this.led.push(colorConverter(this.original[j][0]))
      }
      for(var j=0; j<this.original.length; j++){
        this.ledwebpage.push(colorConverterForWeb(this.original[j][0]))
      }
      function colorConverterForWeb(color){
        var input = new tinycolor(color);               // saves the color into the library
        var toHsl = (input.toHslString()).substring(0,7);             //converst the value to hsl and changes it a little
        toHsl = (toHsl+' 100%, 50%)');
        var hslValue = new tinycolor(toHsl);            // saves the modified  hsl value so it can be used again
        var rgbObj = hslValue.toRgb();                // changes to rgb object
        delete rgbObj['a'];
        return rgbObj;                          //modified led values for one color

      }
      function colorConverter(color){               //input should be a hex string? I think
        var input = new tinycolor(color);               // saves the color into the library
        var toHsl = (input.toHslString()).substring(0,7);             //converst the value to hsl and changes it a little
        toHsl = (toHsl+' 100%, 50%)');
        var hslValue = new tinycolor(toHsl);            // saves the modified  hsl value so it can be used again
        var rgbObj = hslValue.toRgb();                // changes to rgb object
        delete rgbObj['a']
        rgbObj.r = brightness[rgbObj.r];
        rgbObj.g = brightness[rgbObj.g];
        rgbObj.b = brightness[rgbObj.b];
        return rgbObj;                          //modified led values for one color

      }
    }

    function displayColors(orgData){
      var rgbcolordisplay = $(".rgbcolordisplay");
      var hexcolordisplay = $(".hexcolordisplay")
      for (var i=0; (i<orgData.ledwebpage.length && i<10); i++){
        if(i==0){
          let divRow = $("<div>");                          //creates the div row
          divRow.attr("class", "row");
          rgbcolordisplay.append(divRow);                      // adds the class row
          let divCol = $("<div>");
          divCol.attr("class", "col-12");  //remove singlecolordisplay to remove the class that keeps it hidden
          divCol.attr("id", "rgbtitle");
          divCol.css({"padding-top": "10px"});
          divCol.css({"box-shadow": "inset 0 0 10px #000000"});
          divCol.html("RGB for LED's");
          divRow.append(divCol);
        }
          else if(i!=0){
          let divRow = $("<div>");                          //creates the div row
          divRow.attr("class", "row");
          rgbcolordisplay.append(divRow);                      // adds the class row
          let divCol = $("<div>");
          divCol.attr("class", "col-12 singlecolor");  //remove singlecolordisplay to remove the class that keeps it hidden
          divCol.attr("id", "rgb"+i);
          var red = orgData.ledwebpage[i-1].r
          red = red.toString();
          var green = orgData.ledwebpage[i-1].g;
          green = green.toString();
          var blue = orgData.ledwebpage[i-1].b;
          blue = blue.toString();
          var rgb = ("rgb("+red+","+green+","+blue+")");

          divCol.css({"background-color": rgb});
          divCol.css({"box-shadow": "inset 0 0 10px #000000"});
          divRow.append(divCol);
        }
      }

      for (var i=0; (i<orgData.original.length && i<10); i++){
        if(i==0){
          let divRow = $("<div>");                          //creates the div row
          divRow.attr("class", "row");
          hexcolordisplay.append(divRow);                      // adds the class row
          let divCol = $("<div>");
          divCol.attr("class", "col-12");  //remove singlecolordisplay to remove the class that keeps it hidden
          divCol.attr("id", "hextitle");
          divCol.css({"padding-top": "10px"});
          divCol.css({"box-shadow": "inset 0 0 10px #000000"});
          divCol.html("Hex color values");
          divRow.append(divCol);
        }
        if(i!=0){
        let divRow = $("<div>");                          //creates the div row
        divRow.attr("class", "row");
        hexcolordisplay.append(divRow);                      // adds the class row
        let divCol = $("<div>");
        divCol.attr("class", "col-12 singlecolor hex");  //remove singlecolordisplay to remove the class that keeps it hidden
        divCol.attr("id", "hex"+i);
        var hex = orgData.original[i-1][0];
        var red = orgData.ledwebpage[i-1].r
        red = red.toString();
        var green = orgData.ledwebpage[i-1].g;
        green = green.toString();
        var blue = orgData.ledwebpage[i-1].b;
        blue = blue.toString();
        var rgb = ("rgb("+red+","+green+","+blue+")");
        divCol.data("start",hex);
        divCol.data("end",rgb);
        divCol.css({"background-color": hex});
        divCol.css({"box-shadow": "inset 0 0 10px #000000"});
        divRow.append(divCol);
      }
      }
      addColorListeners();          // when the color display div's are made, event listeners are added to them
    }

    function displayImage(url){
      var pic = $('#picture');
      var img = $('#img');
      img.attr("src", url);
      img.attr('class', 'img-responsive');
      pic.append(img);
    }

    var picContainerWidth = $('#picturecontainer').width();               // right when the document load it makes sure the image container is a square
    $('#picturecontainer').css({'height':picContainerWidth+'px'});


    $( window ).resize(function() {                                     // every time the window resizes, it makes sure the image container stays as a square
      var picContainerWidth = $('#picturecontainer').width();
      console.log(picContainerWidth);
      $('#picturecontainer').css({'height':picContainerWidth+'px'});
    });




    $("#colorfields").on("mousedown", function(event){
      if(event.target.id == 'rgb1'){
        led(orgData.led[0]);
      }
      else if(event.target.id == 'rgb2'){
        led(orgData.led[1]);
      }
      else if(event.target.id == 'rgb3'){
        led(orgData.led[2]);
      }
      else if(event.target.id == 'rgb4'){
        led(orgData.led[3]);
      }
      else if(event.target.id == 'rgb5'){
        led(orgData.led[4]);
      }
      else if(event.target.id == 'rgb6'){
        led(orgData.led[5]);
      }
      else if(event.target.id == 'rgb7'){
        led(orgData.led[6]);
      }
      else if(event.target.id == 'rgb8'){
        led(orgData.led[7]);
      }
      else if(event.target.id == 'rgb9'){
        led(orgData.led[8]);
      }
      else if(event.target.id == 'rgb10'){
        led(orgData.led[9]);
      }
    });


    $("#colorfields").on("mouseover", function(event){
      if(event.target.id == 'rgb0'){
        let zero = $("#rgb0");
        zero.css({"box-shadow": `0px 0px 2px 2px ${zero[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb1'){
        let one = $("#rgb1");
        one.css({"box-shadow": `0px 0px 2px 2px ${one[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb2'){
        let two = $("#rgb2");
        two.css({"box-shadow": `0px 0px 2px 2px ${two[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb3'){
        let three = $("#rgb3");
        three.css({"box-shadow": `0px 0px 2px 2px ${three[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb4'){
        let four = $("#rgb4");
        four.css({"box-shadow": `0px 0px 2px 2px ${four[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb5'){
        let five = $("#rgb5");
        five.css({"box-shadow": `0px 0px 2px 2px ${five[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb6'){
        let six = $("#rgb6");
        six.css({"box-shadow": `0px 0px 2px 2px ${six[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb7'){
        let seven = $("#rgb7");
        seven.css({"box-shadow": `0px 0px 2px 2px ${seven[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb8'){
        let eight = $("#rgb8");
        eight.css({"box-shadow": `0px 0px 2px 2px ${eight[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb9'){
        let nine = $("#rgb9");
        nine.css({"box-shadow": `0px 0px 2px 2px ${nine[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
      else if(event.target.id == 'rgb10'){
        let ten = $("#rgb10");
        ten.css({"box-shadow": `0px 0px 2px 2px ${ten[0].style.backgroundColor}, inset 0 0 10px #000000`});
      }
    })

    $("#colorfields").on("mouseout", function(event){
      if(event.target.id == 'rgb0'){
        let zero = $("#rgb0");
        zero.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb1'){
        let one = $("#rgb1");
        one.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb2'){
        let two = $("#rgb2");
        two.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb3'){
        let three = $("#rgb3");
        three.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb4'){
        let four = $("#rgb4");
        four.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb5'){
        let five = $("#rgb5");
        five.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb6'){
        let six = $("#rgb6");
        six.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb7'){
        let seven = $("#rgb7");
        seven.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb8'){
        let eight = $("#rgb8");
        eight.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb9'){
        let nine = $("#rgb9");
        nine.css({"box-shadow": "inset 0 0 10px #000000"});
      }
      else if(event.target.id == 'rgb10'){
        let ten = $("#rgb10");
        ten.css({"box-shadow": "inset 0 0 10px #000000"});
      }
    })

    $(".rgbcolordisplay").on("mouseover", function(event){            //mouse over the rgb colors will show information
      let rgbsvg = $("#rgbsvg");
      if(showinfo){
        console.log('trying to remove??');
        rgbsvg.removeClass("pleasehide")
      }
    });
    $(".rgbcolordisplay").on("mouseout", function(event){            //mouse out will hide the rgb info
      let rgbsvg = $("#rgbsvg");
      if(showinfo){
        rgbsvg.addClass("pleasehide")
      }
    });

    $(".hexcolordisplay").on("mouseover", function(event){          //mouse over the hex colors will show information
      let hexsvg = $("#hexsvg");
      if(showinfo){
        hexsvg.removeClass("pleasehide")
      }
    });
    $(".hexcolordisplay").on("mouseout", function(event){         // mouse out hide the hex info
      let hexsvg = $("#hexsvg");
      if(showinfo){
        hexsvg.addClass("pleasehide")
      }
    });


    $("#picture").on("mouseover",function(){
      console.log('donk');
      $("#picture").css({"box-shadow": '0px 0px 4px 2px white'});
    })
    $("#picture").on("mouseout",function(){
      $("#picture").css({"box-shadow": ""});
    })





    var moveForce = 30; // max popup movement in pixels
    var rotateForce = 20; // max popup rotation in degrees

  $(document).mousemove(function(event) {
      var docX = $(window).width();
      var docY = $(window).height();

      var moveX = (event.pageX - docX/2) / (docX/2) * -moveForce;
      var moveY = (event.pageY - docY/2) / (docY/2) * -moveForce;

      var rotateY = (event.pageX / docX * rotateForce*2) - rotateForce;
      var rotateX = -((event.pageY / docY * rotateForce*2) - rotateForce);
      if(pictureloaded){
        $('.popup')
          .css('left', moveX+'px')
          .css('top', moveY+'px')
          .css('transform', 'rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)');
      }
  });

function addColorListeners() {
  $('.hex').on('mouseenter', function(e) {
    console.log('mouseover');
    $this = $(this);
    console.log($this.prop('id'));
    $this.css('background-color', $this.data("end"));
  })

  $('.hex').on('mouseout', function(e) {
    console.log('mouseover');
    $this = $(this);
    console.log($this.data());
    $this.css('background-color', $this.data("start"));
  })
}
});
