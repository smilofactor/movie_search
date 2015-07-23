$(document).ready(function() {
  'use strict';

  var configMap = {
    $IDSearchResults: $('#search_results'),
    $IDMovieDetails: $('#movie_details'),
    APIUrl: 'http://www.omdbapi.com'
  };

  function filterArray(element) {
    return (typeof element !== 'string' || !!element.trim());
  }

  function mapArray(element) {
    if (typeof element === 'string') {
      return element.trim();
    } else {
      return element;
    }
  }

  function hideListInfo() {
    //configMap.$IDSearchResults.find('#list_info > li').remove();
    configMap.$IDSearchResults.hide();
  };

  var initMovieSearch = function(searchTerm) {
    this.searchTerm = searchTerm;
    this.searchArray = [];
    this.params = {};
    this.html = '';
    this.i = 0;
  };

  var MovieSearch = new initMovieSearch();

  function processRequestLoop(element) {

    if (MovieSearch.params.s !== undefined) {
      MovieSearch.params.s = element;
    } else if (MovieSearch.params.i !== undefined) {
      MovieSearch.params.i = element;
    }

    $.getJSON(configMap.APIUrl, MovieSearch.params, function(data) {

      if (data.Search !== undefined) {
        data.Search.map(function(element) {
          MovieSearch.showResultsList(element);
        });

      } else {
        MovieSearch.html = '';
        MovieSearch.showSelectionDetail(data);
      };

    }).done(function(data) {});

  };

  initMovieSearch.prototype.constructTerm = function() {
    var movieName = this.searchTerm.split(',') || this.searchTerm;
    this.searchArray = movieName.filter(filterArray).map(mapArray);
    this.processGetRequest({
      searchExp: this.searchArray
    });

  };

  initMovieSearch.prototype.processGetRequest = function(searchParams) {
    if (searchParams.params !== undefined) {
      console.log('Object.keys searchParams.params before setting: ' + Object.keys(searchParams.params));
    }

    this.params.r = 'json';
    this.params.s = searchParams.searchExp;
    searchParams.searchExp.map(processRequestLoop);

    this.params = {};

  };

  initMovieSearch.prototype.showSelectionDetail = function(results) {
    this.html += '<h2>' + results.Title + '</h2>';
    console.log('showSelectionDetails: ');
    console.log(results);
    configMap.$IDMovieDetails.append(this.html);
  };

  $('#list_info').on('click', 'li div', function() {
    var output = [];
    MovieSearch.params = {};
    MovieSearch.i = 0;

    hideListInfo();

    output.push($(this).data('movie-info'));

    MovieSearch.params.i = output;
    MovieSearch.params.r = 'json';

    output.map(processRequestLoop);
  });

  initMovieSearch.prototype.showResultsList = function(results) {
    this.html += '<a><li><div data-movie-info=\'' + results.imdbID + '\'>' + results.Year + ' ' + results.Title + '</div></li></a>';
    configMap.$IDSearchResults.find('#list_info').html(this.html);
  };

  var submitSearch = $('#search-term').submit(function(event) {
    event.preventDefault();
    var searchTerm = $('textarea').val();
    MovieSearch.searchTerm = searchTerm;
    MovieSearch.constructTerm();
    MovieSearch.html = '';
    $('textarea').val('');
  });

});