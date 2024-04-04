import { parse, parseInline } from "marked";
import ShortCode from "../utils/ShortCodeParser";

// ShortCodes List
const data = [
  {
    name: "Boxes",
    handler: (element, options) => {
      let cls = options.class ? options.class : "";
      return `<div class="boxes ${cls}">${element}</div>`;
    },
  },
  {
    name: "Box",
    handler: (element, options) => {
      let num = options.num ? options.num : 6;
      let cls = options.class ? options.class : "";
      return `<div class="box-${num} ${cls}">${parse(ShortCode.parse(element))}</div>`;
    },
  },
  {
    name: "Youtube",
    handler: (element, options) => {
      let id = options.id ? options.id : "";
      let title = options.title ? options.title : "";
      let width = options.width ? options.width : "480";
      let height = options.height ? options.height : "320";
      return id
        ? `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden" width="${width}" height="${height}" src="https://www.youtube.com/embed/${id}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
        : "Id not found";
    },
  },
  {
    name: "Dtube",
    handler: (element, options) => {
      let id = options.id ? options.id : "";
      let title = options.title ? options.title : "";
      let width = options.width ? options.width : "480";
      let height = options.height ? options.height : "320";
      return id
        ? `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"> <iframe style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden" width="${width}" height="${height}" src="https://emb.d.tube/#!//('files':('youtube':'${id}'),'dur':'95','thumbnailUrlExternal':'','thumbnailUrl':'https:!!i.ytimg.com!vi!${id}!mqdefault.jpg','nsfw':0,'oc':1)" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
        : "Id not found";
    },
  },
  {
    name: "Archive",
    handler: (element, options) => {
      let id = options.id ? options.id : "";
      let title = options.title ? options.title : "";
      let width = options.width ? options.width : "480";
      let height = options.height ? options.height : "320";
      return id
        ? `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"> <iframe style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden" title="${title}" src="https://archive.org/embed/${id}" width="${width}" height="${height}" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe></div>`
        : "Id not found";
    },
  },
  {
    name: "Dailymotion",
    handler: (element, options) => {
      let id = options.id ? options.id : "";
      let title = options.title ? options.title : "";
      let width = options.width ? options.width : "480";
      let height = options.height ? options.height : "320";
      return id
        ? `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"> <iframe style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden" frameborder="0" type="text/html" src="https://www.dailymotion.com/embed/video/${id}" width="${width}" height="${height}" allowfullscreen title="${title}"></iframe></div>`
        : "Id not found";
    },
  },
  {
    name: "Details",
    handler: (element, options) => {
      let name = options.name ? options.name : "Info";
      let open = options.open ? "open" : "";
      return `<details class="info" ${open}><summary>${name}</summary><div class="info-body">${parseInline(
        element
      )}</div></details>`;
    },
  },
  {
    name: "Color",
    handler: (element, options) => {
      var color = options.name ? options.name : "red";
      return `<span style="color:${color}">${parseInline(element)}</span>`;
    },
  },
  {
    name: "Justify",
    handler: (element, options) => {
      return `<div style="text-align:justify">${parse(element)}</div>`;
    },
  },
  {
    name: "Center",
    handler: (element, options) => {
      return `<div style="text-align:center">${parse(element)}</div>`;
    },
  },
  {
    name: "Right",
    handler: (element, options) => {
      return `<div style="text-align:right">${parse(element)}</div>`;
    },
  },
  {
    name: "Divider",
    handler: (element, options) => {
      let num = options.num ? options.num : 1;
      return `<div class="divider" style="margin:${num}em auto">&nbsp;</div>`;
    },
  },
  {
    name: "Note",
    handler: (element, options) => {
      let extend = options.class ? options.class : "";
      let cls = options.name
        ? `class="note-${options.name} ${extend}"` //info,success,danger
        : `class="note-info ${extend}"`;
      return `<div ${cls}>${parseInline(element)}</div>`;
    },
  },
  {
    name: "Columns",
    handler: (element, options) => {
      let num = options.num ? options.num : 2;
      return `<div class="col-${num}">${parse(element)}</div>`;
    },
  },
  {
    name: "Grid",
    handler: (element, options) => {
      let md = options.md ? options.md : "";
      if(md) return `<div class="grid">${parse(element)}</div>`;
      else return `<div class="grid">${element}</div>`;
    },
  },
  {
    name: "Img",
    handler: (element, options) => {
      let src = options.src ? options.src : "";
      let cls = options.cls ? options.cls : "img-fluid";
      let alt = options.alt ? options.alt : "An image";
      let href = options.href ? options.href : "";
      if(href) {
        if(src) return `<div class="${cls}"><a rel="noopener" target="_blank" href="${href}" title="${alt}"><img src="${src}" alt="${alt}"/></a></div>`;
        else return "Error **src** not exists"
      }else{
        if(src) return `<div class="${cls}"><img src="${src}" alt="${alt}"/></div>`;
        else return "Error **src** not exists"
      }
    },
  },
  {
    name: "Comment",
    handler: (element, options) => {
      return `<!--  ${element} -->`;
    },
  },
];

/**
 * Render ShortCodes.
 * @param {Array} data - The data contained in the Shortcodes.
 */
export default function renderShortCodes() {
  data.forEach((shortCode) => {
    try {
      ShortCode.add(shortCode.name, shortCode.handler);
    } catch (error) {
      console.error(
        `Error adding ShortCode '${shortCode.name}':`,
        error
      );
    }
  });
};