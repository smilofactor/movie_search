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
    if (element) {
      MovieSearch.params.s = element;
    }
    $.getJSON(configMap.APIUrl, MovieSearch.params, function(data) {
      data.Search.map(function(element) {
        if (MovieSearch.params.i === undefined) {
          MovieSearch.showResults(element);
        } else {
          console.log('A new search goes here');
        }
      });
    }).done(function() {
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
    this.params = searchParams.params || {
      r: 'json'
    };
    searchParams.searchExp.map(requestMap);
  };

  initMovieSearch.prototype.selectItem = function() {
    console.log('selectItem activated');
    var params = {};
    $('#list_info li div').on('click', function() {
      console.log('clicked on #list_info li div');
      console.log($(this).data('movie-info'));

      /*
      //clearListInfo();
      var output = $(this).data('movie-info');
      var paramInfo = output.split('-');
      var yearInfo = paramInfo[0].split('_');
      var movieID = paramInfo[1].split('_');
      params.y = yearInfo[1];
      params.i = movieID[1];
      params.r = 'json';
      MovieSearch.getRequest("", params);
      */
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