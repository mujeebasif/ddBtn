/**
 * Created by Mujeeb on 01-Dec-15.
 */

//usage: $('div').ddBtn();

//anonymous function calls itself automatically e.g (function(o_a){})(optional_argument)

(function($){

   //actually $.fn = $.prototype; where $ is constructor function;

   $.fn.ddBtn = function(params){

      var defaults = {
         "wrapperClass" : "",
         "ddBtnIconClass" : "glyphicon glyphicon-cog",//depriciated
         "ddBtnMarkup":{
            "title":"",
            "id":"",
            "class":"btn-info",// support font-awsome, glyphicon
            "text":'<span class="caret"></span>'
         },
         "btnMarkup":{
            "title":"",
            "id":"",
            "class":"btn-info",
            "text":'<i class="fa fa-file-excel-o"></i>',
            "data":""
         },
         "dropDownId":"",
         "ddOptions":[
            {
               "value":"",
               "text":""
            }
         ],
         "ddOptionsSelected":[],
         "enableCookieStorage":false,
         "enableSorting":false,
         "otherMarkup":"",
         "onOptionSelect": function(){},
         "onBtnClick" : function(){}
      };

      //var selectedOptions = [];
      $.fn.ddBtn.selectedOptions = [];//expose to public

      var $wrapper = $( '<div class="btn-group ddBtnGrp" />' );

      // merge default and user parameters
      params = $.extend(true,{},defaults,params);

      //ensure cookie plugin if enabled
      if( params.enableCookieStorage )
      {
         //trim spaces in index
         if(!params.enableCookieStorage.trim().length)
         {
            console.log('invalid index passed in enableCookieStorage');
            params.enableCookieStorage=false;
         }

         //ensure $.cookie plugin is there
         if( typeof $.cookie=="undefined" )
         {
            console.error('Required cookie plugin is missing for enableCookieStorage feature.');
            params.enableCookieStorage=false;
         }

      }

      //fetch default options from cookies
      if(params.enableCookieStorage)
      {
         //trim space in index
         params.enableCookieStorage = params.enableCookieStorage.replace(/ /g,'_');

         var storedOptionsData = $.cookie(params.enableCookieStorage);

         if(storedOptionsData && storedOptionsData.length)
         {
            params.ddOptionsSelected = $.parseJSON(storedOptionsData);
         }
      }

      //initilize with, passed default or stored default
      $.fn.ddBtn.selectedOptions = params.ddOptionsSelected;

      //ensure sortable plugin if enabled
      if( params.enableSorting )
      {
         //ensure sortable plugin is there
         if( typeof $().sortable=="undefined" )
         {
            console.error('Required sortable plugin is missing for enableSorting feature.');
            params.enableSorting=false;
         }
      }

      //------------------------------------------ btnGroup

      $wrapper.addClass(params.wrapperClass);

      //-------------------drop Down btn

      var ddBtnId = (params.ddBtnMarkup.id) ? ' id="'+params.ddBtnMarkup.id+'" ' : '';
      var ddBtnTitle = (params.ddBtnMarkup.title) ? ' title="'+params.ddBtnMarkup.title+'" ' : '';

      var dd_btn = '\
         <button type="button" '+ddBtnId+' '+ddBtnTitle+' \
            class="btn dropdown-toggle '+params.ddBtnMarkup.class+'" data-toggle="dropdown"> \
               '+params.ddBtnMarkup.text+' \
         </button>\
      ';

      //------------------------dropDown

      var ul ='<ul class="dropdown-menu" role="menu" id="'+params.dropDownId+'">'

      var options = params.ddOptions;

      if( $.isArray(options) )
      {
         $(options).each(function(i,obj){

            if( typeof obj ==="object" && typeof obj.value!=="undefined" && obj.text )
            {
               var unchecked = '  ';
               var checked = ' hidden_soft ';
               var selected = false;

               if( $.inArray(obj.value,params.ddOptionsSelected)!=-1 )
               {
                  unchecked = ' hidden_soft ';
                  checked = '';
                  selected = true;
               }

               ul += ' \
                  <li class="dd_chkbox_li" data-val="'+obj.value+'" data-checked="'+selected+'"> \
                     <span class="glyphicon glyphicon-unchecked '+unchecked+'"></span> \
                     <span class="glyphicon glyphicon-check '+checked+'"></span> \
                     <span class="column" >'+obj.text+'</span> \
                  </li> \
               ';

            }

         });
      }

      ul += '</ul>';

      //--------------------- btn

      var btnId = (params.btnMarkup.id) ? ' id="'+params.btnMarkup.id+'" ' : '';
      var btnTitle = (params.btnMarkup.title) ? ' title="'+params.btnMarkup.title+'" ' : '';

      var btnData = '';

      if(params.btnMarkup.data)
      {
         $.each(params.btnMarkup.data,function(i,v){
            btnData += ' data-'+i+'="'+v+'" ';
         });
      }

      var btn = '\
         <button type="button" '+btnId+' '+btnTitle+' \
            class="btn ddBtnGrp_btn '+params.btnMarkup.class+'" '+btnData+' >'+params.btnMarkup.text+'</button> \
      ';

      //----------------------

      $wrapper.append(dd_btn,ul,btn);

      //safe html
      var safe_html = params.otherMarkup.replace(/<\/?(script|iframe|html|body)\b[^<>]*>/g, "");

      if( params.otherMarkup.length )$wrapper.append(safe_html);

      //----------------------------------------------- </btnGroup> --------------------------------------------

      $wrapper.on('click','.dd_chkbox_li',function(ev){
         //ev.preventDefault();

         var $li = $(this);
         var prev_val = $li.data('checked') || false;
         var next_val = (!prev_val);

         $li.data('checked',next_val);

         var $children = $li.children('span');

         if(next_val)//checked
            $children.eq(0).hide().next().show();
         else
            $children.eq(0).show().next().hide();

         params.onOptionSelect.call($li);

         updateSelectedOptions();

         return false;
      });


      $wrapper.on('click','.ddBtnGrp_btn',function(ev){

         var btn = this;

         updateSelectedOptions();

         /*var selectedOptions = [];

         $('ul.dropdown-menu li.dd_chkbox_li',$wrapper).each(function(i,v){

            var $li = $(this);

            if( $li.data('checked') )
            {
               selectedOptions.push($li.data('val'));
            }

         });*/

         //console.log($.fn.ddBtn.selectedOptions);
         params.onBtnClick(btn,$.fn.ddBtn.selectedOptions)

      });

      function updateSelectedOptions()
      {
         var temp = [];

         $('ul.dropdown-menu li.dd_chkbox_li',$wrapper).each(function(i,v){

            var $li = $(this);

            if( $li.data('checked') )
            {
               temp.push($li.data('val'));
            }

         });

         $.fn.ddBtn.selectedOptions=temp;

         //store in cookie
         if(params.enableCookieStorage)
         {
            $.cookie(params.enableCookieStorage,JSON.stringify(temp));
         }
      }


      if( params.enableSorting )
      {
         $('ul.dropdown-menu',$wrapper).addClass('sortable_ul').sortable({
            onDrop: function($item, container, _super) {
               updateSelectedOptions();
               _super($item, container);
            }
         });
      }

      //treverse all nodes
      this.each(function(){

         var $node = $(this);
         $node.append($wrapper);

      });

      //allow chaining
      return this;
   }
})(jQuery);

//example usage

//site/assets/css/jquery.ddBtn.css
//site/assets/js/jquery.ddBtn.js

/*
$('.btn_row').ddBtn({
   "ddOptions":[
      {
         "value":"1",
         "text":"Option1"
      },
      {
         "value":"2",
         "text":"Option2"
      }
   ],
   "btnMarkup":{
      "title":"Export in .XLS format"
   },
   //"onBtnClick":function (btn,selection){console.log(btn,selection);},
   "onBtnClick":exportInXls
});
*/

//to fetch selectedOptions, anytime; $('.btn_row').ddBtn.selectedOptions

//available options

/*
 "wrapperClass" : "",
 "ddBtnMarkup":{
    "title":"",
    "id":"",
    "class":"btn-info",
    "text":'<span class="caret"></span>'
 },
 "btnMarkup":{
    "title":"",
    "id":"",
    "class":"btn-info",
    "text":'<i class="fa fa-file-excel-o"></i>'
 },
 "dropDownId":"",
 "ddOptions":[
    {
    "value":"",
    "text":""
    }
 ],
 "ddOptionsSelected":[],
 "onOptionSelect": function(){},
 "onBtnClick" : function(){}
 */
