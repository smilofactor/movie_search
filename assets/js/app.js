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


function resultsMap(element) {
  //MovieSearch.html = '<li><div>' + element.Title + ' ' + element.Year + '</li></div>';
  //configMap.$IDSearchResults.find('#list_info').append(MovieSearch.html);
  MovieSearch.showResults(element);
};


function requestMap(element) {
    if (element) {MovieSearch.params.s = element;}
    $.getJSON(configMap.APIUrl, MovieSearch.params, function(data) {
    data.Search.map(resultsMap);
    });
};


initMovieSearch.prototype.constructTerm = function() {  
    var movieName = this.searchTerm.split(',') || this.searchTerm;
    this.searchArray = movieName.filter(filterArray).map(mapArray);
    MovieSearch.processGetRequest({searchExp: this.searchArray});
};


initMovieSearch.prototype.processGetRequest = function(searchParams) {
if (searchParams.params !== undefined) { console.log('Object.keys searchParams.params before setting: ' + Object.keys(searchParams.params)); }
  this.params = searchParams.params || {  r: 'json' };  
   searchParams.searchExp.map(requestMap);
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



var html = '';
initMovieSearch.prototype.showResults = function(results) {
  //var html = '';
  console.log('showResults');
  console.log(results.Title);
  html += '<li><div>' + results.Year + ' ' + results.Title + '</div></li>';
  
  /*
  //clearListInfo();
  $.each(results, function(index,value){
  console.log('in .each');
  console.log(value);
  html += '<li><div data-movie-info=\'y_' + value.Year + '-i_' + value.imdbID + '\'>' + value.Title + '  .....Release Year: ' + value.Year + '</div></li>';
  //MovieSearch.html += '<li><div data-movie-info=\'y_' + value.Year + '-i_' + value.imdbID + '\'>' + value.Title + '  .....Release Year: ' + value.Year + '</div></li>';
  });
*/
  
  configMap.$IDSearchResults.find('#list_info').html(html);
  //configMap.$IDSearchResults.find('#list_info').html(MovieSearch.html);
  //this.selectItem();
  };
  
  
  $('#search-term').submit(function(event) {
    event.preventDefault();
    var searchTerm = $('textarea').val();
    MovieSearch.searchTerm = searchTerm;
    MovieSearch.constructTerm();
    $('textarea').val('');
  }); 

});