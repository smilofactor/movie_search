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
  if (typeof element === 'string') { return element.trim(); } 
  else { return element; }
};


function clearListInfo() { 
 //configMap.$IDSearchResults.find('#list_info > li').remove();
 configMap.$IDSearchResults.hide();
};

  
var initMovieSearch = function(searchTerm) {
  this.searchTerm = searchTerm;
  this.searchArray = [];
  this.params = {};
  this.html = '';
  this.movieListObject = [];
};


var MovieSearch = new initMovieSearch(); 


function resultsForEach(element, index, array) {
  console.log('resultsForEach');
  console.log(element);
};

function responseForEach(element, index, array) {
    MovieSearch.movieListObject[element.imdbID] = element;
    //MovieSearch.movieListObject = element;
    //console.log('responseMap element: ');
    //console.log(MovieSearch.movieListObject);
    //MovieSearch.movieListObject.push(element);
    return(MovieSearch.movieListObject);
};


function requestForEach(element, index, array) {
    if (element) {MovieSearch.params.s = element;}
    $.getJSON(configMap.APIUrl, MovieSearch.params, function(data) {
    data.Search.forEach(responseForEach);
    
    //console.log(data.Search);
    //return (data.Search);
    });
};


initMovieSearch.prototype.constructTerm = function() {  
    var movieName = this.searchTerm.split(',') || this.searchTerm;
    this.searchArray = movieName.filter(filterArray).map(mapArray);
    MovieSearch.getRequestMap({searchExp: this.searchArray});
};


initMovieSearch.prototype.searchResultsList = function() {
    console.log('searchResultsList');
    console.log(this.movieListObject);
    
    //this.movieListObject.forEach(resultsForEach);
    //console.log(results);

    /*
    for (var key in this.movieListObject){
      console.log('key: ' + key);}

    //console.log(this.movieListObject);
    //console.log(results);


    $.each(this.movieListObject, function(index,value){
        console.log('searchResultsList results: ' + value.Title);
    });
    */

};


initMovieSearch.prototype.getRequestMap = function(searchParams) {
if (searchParams.params !== undefined) { console.log('Object.keys searchParams.params before setting: ' + Object.keys(searchParams.params)); }
  this.params = searchParams.params || {  r: 'json' };

  //this.movieListObject.push(searchParams.searchExp.forEach(requestForEach));
  //searchParams.searchExp.forEach(requestForEach).forEach(responseForEach);
  searchParams.searchExp.forEach(requestForEach);


  
  this.movieListObject.push(searchParams.searchExp.forEach(requestForEach));

  //this.searchResultsList(this.movieListObject);
  this.searchResultsList();

};



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