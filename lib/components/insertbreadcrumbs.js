module.exports = function (data, query) {
    var object = {}
    object['insertBreadcrumbs'] = '<div>'
    for (var key in data["breadcrumbs"]) {
        var value = data["breadcrumbs"][key]
        object['insertBreadcrumbs'] += '<a href="' + value["url"] + '">' + value["title"] + '</a>'
        if (key <= data["breadcrumbs"].length - 2) {
            object['insertBreadcrumbs'] += ' > '
        }
    }
    object['insertBreadcrumbs'] += '</div>'
    return object
}