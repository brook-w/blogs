"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var fs = require('fs'); // 文件模块


var matter = require('gray-matter'); // FrontMatter解析器 https://github.com/jonschlinkert/gray-matter


var jsonToYaml = require('json2yaml');

var chalk = require('chalk'); // 命令行打印美化
// const arg = process.argv.splice(2)[0]; // 获取命令行传入的参数


var readFileList = require('./modules/readFileList');

var _require = require('./modules/fn'),
    type = _require.type,
    repairDate = _require.repairDate,
    dateFormat = _require.dateFormat;

var log = console.log;

var path = require('path');

var os = require('os');

var PREFIX = '/pages/';
/**
 * 给.md文件设置frontmatter(标题、日期、永久链接等数据)
 */

function setFrontmatter(sourceDir, themeConfig) {
  var isCategory = themeConfig.category,
      isTag = themeConfig.tag,
      _themeConfig$category = themeConfig.categoryText,
      categoryText = _themeConfig$category === void 0 ? '随笔' : _themeConfig$category,
      extendFrontmatter = themeConfig.extendFrontmatter;
  var files = readFileList(sourceDir); // 读取所有md文件数据
  // 扩展自定义生成frontmatter

  var extendFrontmatterStr = extendFrontmatter ? jsonToYaml.stringify(extendFrontmatter).replace(/\n\s{2}/g, "\n").replace(/"|---\n/g, "") : '';
  files.forEach(function (file) {
    var dataStr = fs.readFileSync(file.filePath, 'utf8'); // 读取每个md文件内容
    // fileMatterObj => {content:'剔除frontmatter后的文件内容字符串', data:{<frontmatter对象>}, ...}

    var fileMatterObj = matter(dataStr, {});

    if (Object.keys(fileMatterObj.data).length === 0) {
      // 未定义FrontMatter数据
      var stat = fs.statSync(file.filePath);
      var dateStr = dateFormat(getBirthtime(stat)); // 文件的创建时间

      var categories = getCategories(file, categoryText);
      var cateLabelStr = '';
      categories.forEach(function (item) {
        cateLabelStr += os.EOL + '  - ' + item;
      });
      var cateStr = '';

      if (!(isCategory === false)) {
        cateStr = os.EOL + 'categories:' + cateLabelStr;
      }

      ; // 注意下面这些反引号字符串的格式会映射到文件

      var tagsStr = isTag === false ? '' : "\ntags:\n  - ";
      var fmData = "---\ntitle: ".concat(file.name, "\ndate: ").concat(dateStr, "\npermalink: ").concat(getPermalink()).concat(file.filePath.indexOf('_posts') > -1 ? os.EOL + 'sidebar: auto' : '').concat(cateStr).concat(tagsStr, "\n").concat(extendFrontmatterStr, "---");
      fs.writeFileSync(file.filePath, "".concat(fmData).concat(os.EOL).concat(fileMatterObj.content)); // 写入

      log(chalk.blue('tip ') + chalk.green("write frontmatter(\u5199\u5165frontmatter)\uFF1A".concat(file.filePath, " ")));
    } else {
      // 已有FrontMatter
      var matterData = fileMatterObj.data;
      var hasChange = false; // 已有FrontMatter，但是没有title、date、permalink、categories、tags数据的

      if (!matterData.hasOwnProperty('title')) {
        // 标题
        matterData.title = file.name;
        hasChange = true;
      }

      if (!matterData.hasOwnProperty('date')) {
        // 日期
        var _stat = fs.statSync(file.filePath);

        matterData.date = dateFormat(getBirthtime(_stat));
        hasChange = true;
      }

      if (!matterData.hasOwnProperty('permalink')) {
        // 永久链接
        matterData.permalink = getPermalink();
        hasChange = true;
      }

      if (file.filePath.indexOf('_posts') > -1 && !matterData.hasOwnProperty('sidebar')) {
        // auto侧边栏，_posts文件夹特有
        matterData.sidebar = "auto";
        hasChange = true;
      }

      if (!matterData.hasOwnProperty('pageComponent') && matterData.article !== false) {
        // 是文章页才添加分类和标签
        if (isCategory !== false && !matterData.hasOwnProperty('categories')) {
          // 分类
          matterData.categories = getCategories(file, categoryText);
          hasChange = true;
        }

        if (isTag !== false && !matterData.hasOwnProperty('tags')) {
          // 标签
          matterData.tags = [''];
          hasChange = true;
        }
      } // 扩展自动生成frontmatter的字段


      if (type(extendFrontmatter) === 'object') {
        Object.keys(extendFrontmatter).forEach(function (keyName) {
          if (!matterData.hasOwnProperty(keyName)) {
            matterData[keyName] = extendFrontmatter[keyName];
            hasChange = true;
          }
        });
      }

      if (hasChange) {
        if (matterData.date && type(matterData.date) === 'date') {
          matterData.date = repairDate(matterData.date); // 修复时间格式
        }

        var newData = jsonToYaml.stringify(matterData).replace(/\n\s{2}/g, "\n").replace(/"/g, "") + '---' + os.EOL + fileMatterObj.content;
        fs.writeFileSync(file.filePath, newData); // 写入

        log(chalk.blue('tip ') + chalk.green("write frontmatter(\u5199\u5165frontmatter)\uFF1A".concat(file.filePath, " ")));
      }
    }
  });
} // 获取分类数据


function getCategories(file, categoryText) {
  var categories = [];

  if (file.filePath.indexOf('_posts') === -1) {
    // 不在_posts文件夹
    var filePathArr = file.filePath.split(path.sep); // path.sep用于兼容不同系统下的路径斜杠

    filePathArr.pop();
    var ind = filePathArr.indexOf('docs');

    if (ind !== -1) {
      while (filePathArr[++ind] !== undefined) {
        var item = filePathArr[ind];
        var firstDotIndex = item.indexOf('.');
        categories.push(item.substring(firstDotIndex + 1) || ''); // 获取分类
        // categories.push(filePathArr[ind].split('.').pop()) // 获取分类
      }
    }
  } else {
    // 碎片化文章的分类生成
    var matchResult = file.filePath.match(/_posts\/(\S*)\//);
    var resultStr = matchResult ? matchResult[1] : '';
    var resultArr = resultStr.split('/').filter(Boolean);

    if (resultArr.length) {
      categories.push.apply(categories, _toConsumableArray(resultArr));
    } else {
      categories.push(categoryText);
    }
  }

  return categories;
} // 获取文件创建时间


function getBirthtime(stat) {
  // 在一些系统下无法获取birthtime属性的正确时间，使用atime代替
  return stat.birthtime.getFullYear() != 1970 ? stat.birthtime : stat.atime;
} // 定义永久链接数据


function getPermalink() {
  console.log((Math.random() + Math.random()).toString(16));
  return "".concat(PREFIX + (Math.random() + Math.random()).toString(16).slice(2, 8), "/");
}

module.exports = setFrontmatter;