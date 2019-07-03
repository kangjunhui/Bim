/* 
  结构树
*/
function regtreeBtn(){
  $('#modelTree').draggable();
  $('#treeBtn').click(function (e) {
    e.preventDefault();
    $('#modelTree').toggle();
    loadJG();   //结构
  });

  let jgTreeView;
let ids=[];
let ids_cancel=[];
/**
 * @param  {} nodeinfo
 */
function loadChildNodes(nodeinfo) {

  let nodes = [];
  let element = bimEngine.projectData.bimScene.FindNode(nodeinfo.Id);

    if (element != null) {
    for (let i = 0,len=element.Children.length; i < len; i++) {
      node = loadChildNodes(element.Children[i]);
      let e = element.Children[i];
      nodes.push({
        id: e.Id,
        text: e.Name,

        level: e.Level,
        checked: 1,
        items: node
      });
    }
  }

  return nodes;
}

/**
 * @param  {} nodeinfo
 * @param  {} callback
 */
function onLoadChildNodes(nodeinfo, callback) {
  let element = bimEngine.projectData.bimScene.FindNode(nodeinfo.id);


    if (element != null) {
    let childs = element.Children;
    let nodes = [];
    for (let i = 0,len= childs.length; i <len; i++) {
      let childnode = childs[i];
      nodes.push({
        text: childnode.Name,
        id: childnode.Id,
        children: childnode.Children.length > 0,
        level: childnode.Level,
        state: {
          checked: false,
            selected:false
        },
          icon:"fa fa-envira",
      });
    }
    callback(nodes);
  }
}

/**
 * 读取结构树
 */
function loadJG() {

    if (!$('#JG_tree').hasClass('jstree')) {
    $('#JG_tree').empty();

	  $('#JG_tree').jstree({
           'types':{
               'default':{
                   'icon':false
               },
                          },

            'core': {
                'data': function (node, cb) {
                    onLoadChildNodes(node, cb);
                },
                "themes": {
                    'name': 'proton',
                    "dots": true
                }
            },
            'plugins': ["wholerow","checkbox"],
            'checkbox': {
                "keep_selected_style" : false,
                'tie_selection' :false
              }
        });

        uitree = $('#JG_tree').jstree(true);
        $('#JG_tree').on("check_node.jstree", function (e, data) {
            let text = data.node.original.text;

            bimEngine.searchElementsByText(text, function (result, text) {
                result.list.forEach(function (data) {
                    ids.push(data.Element.GlobalId);
                });
                bimEngine.getHighlightManager().highlightElementList(ids);
                _nowElementList=_nowElementList.concat(ids);
                // bimEngine.setElementListVisible(ids,true);
            });

        })

        $('#JG_tree').on("uncheck_node.jstree", function (e, data) {
            let text = data.node.original.text;

            bimEngine.searchElementsByText(text, function (result, text) {
                result.list.forEach(function (data) {
                    ids_cancel.push(data.Element.GlobalId);
                });
                bimEngine.getHighlightManager().unHighlightElementList(ids_cancel);
                // bimEngine.setElementListVisible(ids_cancel,false);
            });


                  });



    }

  }

}