function modelToTree(element) {
    if ($('#treeTab [href="#typeTree"]').hasClass('active')) {
        let typeTree = $('#typeTree').jstree(true)
        let typeNode = typeTree.get_node({
            id: element.GlobalId
        })
        if (typeNode && !typeNode.state.selected) {
            typeTree.select_node({
                id: element.GlobalId
            })
        } else if (typeNode && typeNode.state.selected) {
            typeTree.deselect_node({
                id: element.GlobalId
            })
        }
    } else if ($('#treeTab [href="#objTree"]').hasClass('active')) {
        let objTree = $('#objTree').jstree(true)
        let objNode = objTree.get_node({
            id: element.GlobalId
        })
        if (objNode && !objNode.state.selected) {
            objTree.select_node({
                id: element.GlobalId
            })
        } else if (objNode && objNode.state.selected) {
            objTree.deselect_node({
                id: element.GlobalId
            })
        }
    } else {
        updateChart(element.GlobalId)
    }
}