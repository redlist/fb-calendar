'use strict';

import $ from 'jquery';
import _ from 'underscore';

var data = [
  //{id : 0, start : 0, end : 50}, 
  {id : 1, start : 60, end : 120}, 
  {id : 2, start : 100, end : 240},
  {id : 3, start : 200, end : 410},
  {id : 4, start : 220, end : 450},
  {id : 5, start : 400, end : 720},
  {id : 6, start : 300, end : 650},
  {id : 7, start : 680, end : 720},
  {id : 8, start : 680, end : 720} 
];

var util = {
  assignColumn: function(events, itemIdx){
    let col = 0;
    let item = events[itemIdx];
    let prevItem = events[itemIdx-1];
    if(itemIdx === 0){
      col = 0;
    } else if(util.checkForOverlap(item, prevItem)){
      for(var key in util.columnIndex){
        console.log(prevItem.column);
        console.log(util.columnIndex[key]);
      }
      col = prevItem.column + 1;
    } else{
      col = 0;
    }
    if(!util.columnIndex[col]){
      util.columnIndex[col] = [];
    }
    util.columnIndex[col].push(itemIdx);
    // console.log(util.columnIndex[col]);
    return col;
  },
  // buildColumnArray: function(events){
  //   var arr = [];
  //   events.forEach(function(v,i){
  //     arr.push(v.column);
  //   });
  //   return arr;
  // },
  checkForOverlap: function(e1, e2){
    if (e1.id === e2.id){
      return false;
    }
    else if (e1.end >= e2.start && e2.end >= e1.start) {
      return true;
    } else {
      return false;
    }
  },
  columnIndex: {
    0: []
  },
  getColumnArray: function(cols){
    var arr = [];
    cols.forEach(function(v,i){
      arr.push(v.column);
    });
    return arr;
  },
  getHighestInArray: function(arr){
    return Math.max.apply(null, arr);
  },
  getTotalColumns: function(cols){
    return util.getHighestInArray(util.getColumnArray(cols));
  }
};

function layOutDay(events) {
  var arr = [];
  events.forEach(function(v,i){
    var overlappedEvents = [];
    events.forEach(function(w,j){
      if(util.checkForOverlap(v,w)){
        overlappedEvents.push(j);
      }
    });
    arr.push({
      end: v.end,
      height: v.end - v.start,
      id: v.id,
      overlappedEvents: overlappedEvents,
      start: v.start
    });
  });
  arr.forEach(function(v,i){
    v.column = util.assignColumn(arr, i);
  });
  console.log(util.columnIndex);
  console.log(arr);
  arr.forEach(function(v,i){
    var columnSet = [];
    arr.forEach(function(v,i){
      columnSet.push(v.column);
    });
    var highest = util.getHighestInArray(columnSet);
    v.left = (600/(highest+1)) * v.column;
    v.width = (600/(highest+1)); //20 is column padding
    if(!v.overlappedEvents.length){
      v.width = 600;
    }
    console.log('event ' + (v.id - 1) + ' overlaps: ' + v.overlappedEvents, v);
    // let conflictedCols = [];
    // v.overlappedEvents.forEach(function(w,j){
    //   conflictedCols.push(arr[w].column);
    //   //console.log('id: ' + v.id, v.column, arr[w].column - 1 ,util.getTotalColumns(arr))
    // });
    // console.log(i, conflictedCols);
    // let highestCol = util.getHighestInArray(conflictedCols);
    // let nextHighestCol = 0;
    // if(conflictedCols.length > 1){
    //   nextHighestCol = util.getHighestInArray(_.without(conflictedCols, highestCol));
    // }
    // if(v.column > nextHighestCol  && v.column < highestCol){
    //   console.log('hello', i, v.column);
    // }
    //
    // console.log(i, v.overlappedEvents, highestCol, nextHighestCol);
    // var highestCol = [];
    // v.overlappedEvents.forEach(function(w,j){
    //   console.log(arr[w]);
    //   highestCol.push(arr[w].column);
    // });
    // highestCol = util.getHighestInArray(highestCol);
    // var highestColOffset = arr[highestCol].left;
    //v.left = highestColOffset / v.overlappedEvents.length - 1;
    // v.width = highestColOffset / v.overlappedEvents.length - 1;
    // for(var j = 0; j < overlappedEvents.length -1 ; j++ ){
    //   v.left = 
    // }
    // get the highest column in overlappedEvents
    // if there is not an event in the overlappedEvents that is greater than v, but less than highest
    // if its not conflicting with something in the next column
    // and its not the last column (create global for column total)
    // count the conflicting events in previous columns (var conflicts)
    // apply equal widths (highest conflicting column.left / conflicting prev columns)
    // this gets width
    // for each one width is applied to, left = i * equal width number 
  });


  return arr;
}

function render(events){
  events.forEach(function(v,i){
    var el = '<div class="calendar-wrapper__item" data-id="' + v.id + '">' +
      'Event #: ' + i + ' || Column: ' + v.column +
      '</div>';
    $('.calendar-wrapper').append(el);
    $('[data-id="' + v.id + '"]').css({
      height: v.height,
      left: v.left,
      top: v.start,
      width: v.width
    });
  });
}

render(layOutDay(data));

