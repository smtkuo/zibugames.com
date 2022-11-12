module.exports = function (data, query) {
    var object = {}
    object['gameCategoriesLinks'] = ``;
    object['gameCategoriesHtml'] = `<div class="flex flex-wrap items-stretch self-center content-center place-content-center">`;
    if (data['gameCategories'] != null) {
        data['gameCategories'].sort(() => Math.random() - 0.5)
        for (var key in data['gameCategories']) {
            if (key > 25) {
                break;
            }
            var value = data['gameCategories'][key]
            if (query.keyword != null && query.keyword != "") {
                if (!Object.index.strstr(value, query.keyword)) {
                    continue;
                }
            }
            value = value.replace('#', '').replace(' ', '-')
            object['gameCategoriesHtml'] += `
				<a href='${process.env.PROJECT_Main}/cat/${value}' class="btn glass w-full my-2"><i class="fa fa-gamepad m-1" aria-hidden="true"></i> ${value.replace('-', ' ')}</a>
				`
            object['gameCategoriesLinks'] += `<button onclick="location.href = '${process.env.PROJECT_Main}/cat/${value}';" class="btn glass m-1"><i class="fa fa-gamepad m-1" aria-hidden="true"></i> ${value.replace('-', ' ')}</button>`;
        }

    }
    object['gameCategoriesHtml'] += `</div>`;

    return object
}