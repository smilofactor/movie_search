$(document).ready(function() {
'use strict';

var configMap = {
    $IDSearchResults: $('#search_results'),
    APIUrl: 'http://www.omdbapi.com'
};


function filterArray(element) {
  return (typeof element !== 'string' || !! element.trim());
};


function mapArray(element) {
  if (typeof element === 'string') {
    return element.trim();
  } else {
    return element;
  }
};


function clearListInfo() { 
 //configMap.$IDSearchResults.find('#list_info > li').remove();
 configMap.$IDSearchResults.hide();
};
  
  
var initMovieSearch = function(searchTerm) {
  this.searchTerm = searchTerm;
  this.searchArray = [];
  this.params = new Object();
  this.namesID = 0;
};

var MovieSearch = new initMovieSearch(); 




initMovieSearch.prototype.constructTerm = function() {  
    var movieName = this.searchTerm.split(',') || this.searchTerm;

    this.searchArray = movieName.filter(filterArray).map(mapArray);
    
    /*  
    this.searchArray = this.searchTerm.split(',') || this.searchTerm;
    this.searchArray = this.searchArray.filter(processArray);
    console.log(this.searchArray);
    */

  /*
    this.searchTerm = movieName;
    for(this.namesID; this.namesID < this.searchTerm.length; this.namesID++) {
      this.searchTerm[this.namesID].trim();
      console.log("this is this.searchTerm[this.namesID]: " + this.searchTerm[this.namesID]);
      if (this.searchTerm[this.namesID].length >= 2) {
        console.log('this.searchTerm[this.namesID].length: ' + this.searchTerm[this.namesID].length);
      this.searchArray.push(this.searchTerm[this.namesID].trim());
      }
    }
    */

    console.log('this.searchArray: ' + this.searchArray);



};

initMovieSearch.prototype.runnerDelay = function(limitArray) {
    var limitArray = this.searchArray || limitArray;
    console.log('delayRunner limitArray: ' + limitArray);
    console.log('delayRunner this.namesID: ' + this.namesID)

    function counterFunction() {
      var counterVal = 0;
      for (counterVal; counterVal < limitArray.length; counterVal++){
        console.log('counterFunction limitArray.length: ' + limitArray.length);
      //for (counterVal; counterVal < this.namesID; counterVal++){
        console.log('counterFunction counterVal: ' + counterVal);
        //runRequest(counterVal);

      }
    };

    function runRequest(counterVal) {
      console.log('runRequest counterVal: ' + counterVal);
      var distanceArray = limitArray[counterVal];
      setInterval(function() counterFunction(), 4000);
      console.log('In runRequest limitArray[counterVal]: ' + limitArray[counterVal]);
    }

    counterFunction();

};

  
initMovieSearch.prototype.getRequest = function(searchExp, params){ 

if (this.params !== undefined) {console.log('Object.keys this.params before setting: ' + Object.keys(this.params)); }
  console.log('getRequest searchExp: ' + searchExp);
  this.params = params || {
    s: searchExp,
    r: 'json'
  };
   
  $.getJSON(configMap.APIUrl, this.params, function(data){
  MovieSearch.showResults(data.Search);
  });

 };
 
  
initMovieSearch.prototype.ConstructResults = function() {
  
}
  
initMovieSearch.prototype.selectItem = function() {
  var params = {};
  $('#list_info li div').one('click', function() {
  clearListInfo();
  var output = $(this).data('movie-info');
  var paramInfo = output.split('-');
  var yearInfo = paramInfo[0].split('_');
  var movieID = paramInfo[1].split('_');
  params.y = yearInfo[1];
  params.i =  movieID[1];
  params.r = 'json';
  MovieSearch.getRequest("", params);
    });
  };

  
initMovieSearch.prototype.showResults = function(results) {
    var html = '';
    //clearListInfo();
    $.each(results, function(index,value){
    html += '<li><div data-movie-info=\'y_' + value.Year + '-i_' + value.imdbID + '\'>' + value.Title + '  .....Release Year: ' + value.Year + '</div></li>';
    });
    configMap.$IDSearchResults.find('#list_info').html(html);
    this.selectItem();
  };
  
  
  $('#search-term').submit(function(event) {
    event.preventDefault();
    var searchTerm = $('textarea').val();
    MovieSearch.searchTerm = searchTerm;
    MovieSearch.constructTerm();
    $('textarea').val('');
  }); 

});