# ddBtn
bootstrap button with dropdown/menue having options with checkboxes

customised version of [Button dropdowns](http://getbootstrap.com/components/#btn-dropdowns)

![example1.png](/docs/example1.png) ![example2.png](/docs/example2.png)


#example usage

include
jquery.ddBtn.css &
jquery.ddBtn.js

```
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
```

to fetch selectedOptions, any time; 
```
$('.btn_row').ddBtn.selectedOptions
```

following options can be passed while initialization.
```
var options = {
         "wrapperClass" : "",
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
      }
```	  
