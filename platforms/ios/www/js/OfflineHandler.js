/*offline event handlers*/

var offlineHandlerObj=[
{
 'element':'#offline_cloud-icon',
 'elementHandler':function(inp)
 {
 var jqObj=this.element;
 	$(jqObj).css('display',inp);
 }
},
{
 'element':'.refresh_btn',
 'elementHandler':function(inp)
 {
   var jqObj=this.element;
 	$(jqObj).css('display',inp);
 }
}
];


