$(document).ready(function() {
  'use strict';

  var configMap = {
    $IDSearchResults: $('#search_results'),
    APIUrl: 'http://www.omdbapi.com'
  };

  function filterArray(element) {
    return (typeof element !== 'string' || !!element.trim());
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
    this.params = {};
    this.html = '';
  };

  var MovieSearch = new initMovieSearch();

  function requestMap(element) {
 
    console.log('requestMap element:');
    console.log(element); 

    //console.log('requestMap MovieSearch.params.s:');
    //console.log(MovieSearch.params.s);

    var responseKey = {};
    if (MovieSearch.params.s !== undefined) {
      MovieSearch.params.s = element;
      responseKey.val = 'Search';
    } else if (MovieSearch.params.i !== undefined) {
      MovieSearch.params.i = element;
      responseKey.val = 'Title';
    }
     
    $.getJSON(configMap.APIUrl, MovieSearch.params, function(data) {
      console.log('resposneKey[val]:');
      console.log(responseKey[val]);
      //data.Search.map(function(element) {
      data.responseKey[val].map(function(element) {
        MovieSearch.showResults(element);
      });
    }).done(function() {
      //MovieSearch.params = {};
      MovieSearch.selectItem();
    });

  };

  initMovieSearch.prototype.constructTerm = function() {
    var movieName = this.searchTerm.split(',') || this.searchTerm;
    this.searchArray = movieName.filter(filterArray).map(mapArray);
    MovieSearch.processGetRequest({
    searchExp: this.searchArray
    });
  };


  initMovieSearch.prototype.processGetRequest = function(searchParams) {
    if (searchParams.params !== undefined) {
      console.log('Object.keys searchParams.params before setting: ' + Object.keys(searchParams.params));
    }

    console.log(searchParams);

    
    this.params.r = 'json';

    this.params.s = searchParams.searchExp;

    searchParams.searchExp.map(requestMap);

    this.params = {};

  };


  initMovieSearch.prototype.selectItem = function() {
    console.log('selectItem activated');
    //var params = {};
    
    $('#list_info li div').on('click', function() {
      console.log('clicked on #list_info li div');
      console.log($(this).data('movie-info'));

      //clearListInfo();
      var output = [];
      output.push($(this).data('movie-info'));
      //var paramInfo = output.split('-');
      //var yearInfo = paramInfo[0].split('_');
      //var movieID = paramInfo[1].split('_');
      //this.params.y = yearInfo[1];
      //this.params.i = movieID[1];
      //this.params.r = 'json';


      //Why cant I use 'this' here:
      MovieSearch.params.i = output;

      //console.log(MovieSearch.params.i);
      output.map(requestMap);

      //MovieSearch.getRequest("", params);

    });
  };


  initMovieSearch.prototype.showResults = function(results) {
    //console.log('showResults');
    //console.log(results.Title);
    this.html += '<li><div data-movie-info=\'' + results.imdbID + '\'>' + results.Year + ' ' + results.Title + '</div></li>';
    configMap.$IDSearchResults.find('#list_info').html(this.html);
  };

  $('#search-term').submit(function(event) {
    event.preventDefault();
    var searchTerm = $('textarea').val();
    MovieSearch.searchTerm = searchTerm;
    MovieSearch.constructTerm();
    MovieSearch.html = '';
    $('textarea').val('');
  });

});