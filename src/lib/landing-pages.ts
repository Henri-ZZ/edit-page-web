export type LandingSlug = 'edit-text-on-webpage' | 'replace-images-on-webpage' | 'remove-elements-from-webpage' | 'full-page-screenshot';
export type LandingLang = 'en' | 'zh';

export interface LandingCopy {
  slug: LandingSlug;
  icon: 'edit' | 'image' | 'remove' | 'screenshot';
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  cta: string;
  secondaryCta: string;
  benefitsTitle: string;
  benefits: { title: string; text: string }[];
  stepsTitle: string;
  steps: { title: string; text: string }[];
  useCasesTitle: string;
  useCases: { title: string; text: string }[];
  noteTitle: string;
  notes: string[];
  faqTitle: string;
  faqs: { question: string; answer: string }[];
}

const pages: Record<LandingLang, Record<LandingSlug, LandingCopy>> = {
  en: {
    'edit-text-on-webpage': {
      slug: 'edit-text-on-webpage', icon: 'edit',
      title: 'Edit Text on Any Webpage — Edit Page Chrome Extension',
      description: 'Edit webpage text directly in your browser without code. Click text, type in place, undo changes, and create clean mockups with Edit Page.',
      eyebrow: 'Edit webpage text', heading: 'Rewrite text directly on any webpage',
      intro: 'Click visible text and type right where it appears—no developer tools, no code, and no confirmation dialog. Edit Page is built for quick mockups, copy reviews, and visual experiments.',
      cta: 'Install Edit Page', secondaryCta: 'See the full guide',
      benefitsTitle: 'A faster way to test words in context',
      benefits: [
        { title: 'Type directly on the page', text: 'Place the caret in visible text and edit it as naturally as a document.' },
        { title: 'Review copy in its real layout', text: 'See line breaks, spacing, and visual hierarchy before handing copy to a developer.' },
        { title: 'Undo without risk', text: 'Changes stay in your browser. Undo individual edits or refresh the page to restore the original.' }
      ],
      stepsTitle: 'How to edit webpage text',
      steps: [
        { title: 'Open the extension', text: 'Visit a regular webpage, open Edit Page, and choose Edit text.' },
        { title: 'Click and type', text: 'Click the text you want to change. A caret appears so you can edit it in place.' },
        { title: 'Review or capture', text: 'Check the updated layout, then take a screenshot or simply refresh to restore the page.' }
      ],
      useCasesTitle: 'Useful for more than quick copy edits',
      useCases: [
        { title: 'Product and design reviews', text: 'Try shorter labels, clearer calls to action, and alternate headlines in the live layout.' },
        { title: 'Localization previews', text: 'Check whether translated strings fit before engineering work begins.' },
        { title: 'Content approvals', text: 'Create realistic screenshots that help clients and teammates review proposed wording.' }
      ],
      noteTitle: 'Good to know',
      notes: ['Browsers block extensions on protected pages such as the Chrome Web Store and internal browser pages.', 'If clicking linked text navigates away, start editing nearby text first, then use the arrow keys to move the caret into the linked element.', 'Edits are temporary and local to the current tab; refreshing restores the original webpage.'],
      faqTitle: 'Webpage text editing FAQ',
      faqs: [
        { question: 'Does Edit Page change the real website?', answer: 'No. Your edits are applied locally in the current browser tab and are not uploaded to or saved by the website.' },
        { question: 'Do I need HTML or developer tools?', answer: 'No. Choose Edit text, click visible text, and type directly on the page.' },
        { question: 'Can I edit text inside a link?', answer: 'Usually yes. If the link opens when clicked, enter edit mode on nearby text and move the caret with the keyboard arrow keys.' }
      ]
    },
    'replace-images-on-webpage': {
      slug: 'replace-images-on-webpage', icon: 'image',
      title: 'Replace Images on Any Webpage — Edit Page',
      description: 'Preview a new image on an existing webpage in seconds. Upload a local file or paste an image URL—without changing the original site.',
      eyebrow: 'Replace webpage images', heading: 'Preview new images in the real page layout',
      intro: 'Replace a visible image with a local file or image URL and see the result immediately. It is a quick way to validate campaign art, product photos, avatars, and hero graphics.',
      cta: 'Install Edit Page', secondaryCta: 'See the full guide',
      benefitsTitle: 'Test visuals before implementation',
      benefits: [
        { title: 'Upload or paste a URL', text: 'Use an image from your computer or test an image already hosted online.' },
        { title: 'Keep the existing layout', text: 'Preview the replacement inside the page’s current size, spacing, and surrounding content.' },
        { title: 'Work locally', text: 'The replacement is only a browser preview. Edit Page does not modify the source website.' }
      ],
      stepsTitle: 'How to replace an image',
      steps: [
        { title: 'Choose Change image', text: 'Open Edit Page on the target webpage and select the image replacement tool.' },
        { title: 'Select an image', text: 'Click the image on the page, then upload a local file or paste a direct image URL.' },
        { title: 'Compare the result', text: 'Review crop and composition in context. Undo the change or refresh whenever you are done.' }
      ],
      useCasesTitle: 'Common image preview workflows',
      useCases: [
        { title: 'Campaign approvals', text: 'Place a proposed banner or campaign visual into the live destination page.' },
        { title: 'E-commerce merchandising', text: 'Compare product photography and see how different crops behave in a product grid.' },
        { title: 'Portfolio mockups', text: 'Create credible before-and-after visuals without rebuilding the page in a design tool.' }
      ],
      noteTitle: 'Image replacement tips',
      notes: ['For the most realistic result, use an image with a similar aspect ratio to the original.', 'Some images are backgrounds rather than regular image elements and may not be selectable.', 'Protected browser pages do not allow extension tools to run.'],
      faqTitle: 'Image replacement FAQ',
      faqs: [
        { question: 'Can I upload an image from my computer?', answer: 'Yes. Choose a local image file, or use a direct image URL when the asset is already online.' },
        { question: 'Will the website owner see my replacement?', answer: 'No. The preview stays in your current browser tab and does not update the website server.' },
        { question: 'Why does an image look cropped?', answer: 'The webpage keeps its existing image dimensions and styling. Use a replacement with a similar aspect ratio for a closer fit.' }
      ]
    },
    'remove-elements-from-webpage': {
      slug: 'remove-elements-from-webpage', icon: 'remove',
      title: 'Remove Elements from a Webpage — Edit Page',
      description: 'Hide distracting webpage elements locally with one click. Clean up banners, sidebars, overlays, and other content for mockups or screenshots.',
      eyebrow: 'Remove webpage elements', heading: 'Clean up a webpage with one click',
      intro: 'Temporarily remove distracting sections from the page you are viewing. Create cleaner screenshots, explore simpler layouts, or focus a review on the content that matters.',
      cta: 'Install Edit Page', secondaryCta: 'See the full guide',
      benefitsTitle: 'Less clutter, clearer feedback',
      benefits: [
        { title: 'Point and remove', text: 'Choose the tool and click the visible element you want to hide.' },
        { title: 'Explore layout alternatives', text: 'Remove banners, cards, navigation, or sidebars to see how a simpler composition feels.' },
        { title: 'Restore at any time', text: 'Undo recent removals or refresh the tab to return to the original page.' }
      ],
      stepsTitle: 'How to remove a webpage element',
      steps: [
        { title: 'Choose Remove element', text: 'Open Edit Page and activate the removal tool.' },
        { title: 'Highlight the target', text: 'Move across the page to preview which element will be selected.' },
        { title: 'Click to remove', text: 'Click once to hide it locally, then undo or refresh when you want the original back.' }
      ],
      useCasesTitle: 'When a cleaner page helps',
      useCases: [
        { title: 'Focused screenshots', text: 'Remove cookie banners, floating widgets, or unrelated blocks before capturing a page.' },
        { title: 'Design critique', text: 'Compare a page with and without a component during a live review.' },
        { title: 'Presentation preparation', text: 'Reduce visual noise so an example page supports the point you are presenting.' }
      ],
      noteTitle: 'Removal is temporary',
      notes: ['Edit Page hides the selected page element only in your current tab; it never deletes website content.', 'Some visible areas are made from several nested elements, so you may need to undo and select a larger or smaller region.', 'Browser-protected pages do not permit extension code injection.'],
      faqTitle: 'Element removal FAQ',
      faqs: [
        { question: 'Can removing an element break the website?', answer: 'The live website is not changed. A complex page may look different temporarily, but refreshing restores its original state.' },
        { question: 'Can I undo a removal?', answer: 'Yes. Use Edit Page’s undo control, or refresh the webpage to reset all local edits.' },
        { question: 'Does this work on pop-ups and banners?', answer: 'It works on many regular page elements, including common banners and overlays, although protected or cross-origin content may not be selectable.' }
      ]
    },
    'full-page-screenshot': {
      slug: 'full-page-screenshot', icon: 'screenshot',
      title: 'Full-Page Screenshot Chrome Extension — Edit Page',
      description: 'Capture a full webpage or the current viewport with Edit Page. Save long pages after editing text, replacing images, or removing distractions.',
      eyebrow: 'Full-page screenshots', heading: 'Capture the entire webpage, not just the screen',
      intro: 'Save the current viewport or let Edit Page scroll and capture a long page from top to bottom. Combine screenshots with local page edits to create polished review-ready visuals.',
      cta: 'Install Edit Page', secondaryCta: 'See the full guide',
      benefitsTitle: 'From quick capture to complete page record',
      benefits: [
        { title: 'Two capture modes', text: 'Save exactly what is visible or capture the full scrollable webpage.' },
        { title: 'Capture your edits', text: 'Edit text, replace images, and remove distractions before taking the screenshot.' },
        { title: 'Keep data on your device', text: 'The capture is produced locally and downloaded through your browser.' }
      ],
      stepsTitle: 'How to take a full-page screenshot',
      steps: [
        { title: 'Prepare the page', text: 'Finish any local edits and wait for images or fonts to load.' },
        { title: 'Choose Screenshot', text: 'Open Edit Page and select Current viewport or Full page.' },
        { title: 'Let the capture finish', text: 'Keep the tab visible while Edit Page scrolls, stitches, and prepares the download.' }
      ],
      useCasesTitle: 'What full-page captures are good for',
      useCases: [
        { title: 'Website QA', text: 'Record the full page after a content or visual review and share one continuous artifact.' },
        { title: 'Competitive research', text: 'Keep a dated visual reference of a public landing page or product experience.' },
        { title: 'Client approvals', text: 'Share a polished mockup that includes your proposed text and image changes.' }
      ],
      noteTitle: 'For smoother full-page captures',
      notes: ['Keep the tab active while the page is scrolling and being stitched.', 'Sticky headers, lazy-loaded content, animations, or infinitely scrolling pages can affect the final image.', 'Use Current viewport when you only need the visible browser area.'],
      faqTitle: 'Full-page screenshot FAQ',
      faqs: [
        { question: 'What is the difference between viewport and full page?', answer: 'Current viewport captures only the visible area. Full page automatically captures the scrollable page from top to bottom.' },
        { question: 'Can I screenshot a page after editing it?', answer: 'Yes. Your temporary text, image, and element changes are included in the screenshot.' },
        { question: 'Why does a sticky header appear more than once?', answer: 'Some fixed or animated page elements can be repeated while a long page is captured. Temporarily removing the element can produce a cleaner result.' }
      ]
    }
  },
  zh: {} as Record<LandingSlug, LandingCopy>
};

pages.zh = {
  'edit-text-on-webpage': {
    ...pages.en['edit-text-on-webpage'],
    title: '直接编辑网页文字 — Edit Page 浏览器插件', description: '无需代码，直接在网页原位置修改文字。适合文案校对、本地化预览、产品评审和网页效果演示。',
    eyebrow: '编辑网页文字', heading: '像编辑文档一样，直接修改网页文字', intro: '点击网页上的文字，光标会直接出现在原位置，无需开发者工具，也没有二次确认弹窗。快速验证标题、按钮文案和翻译在真实页面中的效果。',
    cta: '安装 Edit Page', secondaryCta: '查看完整教程', benefitsTitle: '在真实页面里验证文案',
    benefits: [{title:'直接原位输入',text:'在可见文字中放置光标，像编辑文档一样修改。'},{title:'真实版式预览',text:'立即观察换行、间距和层级，不必先让开发人员改代码。'},{title:'随时安全还原',text:'修改只在当前浏览器标签页生效，可逐步撤销或刷新恢复。'}],
    stepsTitle:'如何修改网页文字', steps:[{title:'打开编辑文字',text:'进入普通网页，打开 Edit Page，在控制面板中选择“编辑文字”。'},{title:'点击并输入',text:'点击目标文字，光标出现后直接增删和修改内容。'},{title:'检查或截图',text:'确认新文案的排版效果，保存截图，或刷新页面恢复原状。'}],
    useCasesTitle:'适合这些文案工作', useCases:[{title:'产品与设计评审',text:'在真实界面中尝试更短的标签、更清晰的按钮和不同标题。'},{title:'本地化预览',text:'开发前检查中文、英文或其他语言是否会溢出或换行异常。'},{title:'内容确认',text:'制作接近最终效果的截图，让客户和团队更直观地确认文案。'}],
    noteTitle:'使用提示', notes:['Chrome 应用商店、浏览器内部页面等受保护页面禁止插件注入，因此无法编辑。','如果点击带链接的文字会直接跳转，可先点击附近的普通文字进入编辑状态，再用键盘方向键将光标移入链接文字。','所有修改均为当前标签页中的临时效果，刷新后网页会恢复原状。'],
    faqTitle:'编辑网页文字常见问题', faqs:[{question:'会修改网站上的真实内容吗？',answer:'不会。修改只存在于当前浏览器标签页，不会上传到网站或写入服务器。'},{question:'需要懂 HTML 或开发者工具吗？',answer:'不需要。选择“编辑文字”，点击可见文字后直接输入即可。'},{question:'链接里的文字可以修改吗？',answer:'通常可以。如果点击时发生跳转，请先在附近文字中进入编辑状态，再用方向键移动光标。'}]
  },
  'replace-images-on-webpage': {
    ...pages.en['replace-images-on-webpage'], title:'直接替换网页图片 — Edit Page 浏览器插件', description:'上传本地图片或粘贴图片 URL，在现有网页中即时预览替换效果，不改动原网站。',
    eyebrow:'替换网页图片', heading:'把新图片放进真实网页里预览', intro:'用本地文件或图片 URL 替换网页上的现有图片，立即检查尺寸、裁切和整体观感。适合广告图、商品图、头像和首屏视觉的快速确认。', cta:'安装 Edit Page', secondaryCta:'查看完整教程',
    benefitsTitle:'实现前先看真实效果', benefits:[{title:'上传或粘贴链接',text:'既可以选择电脑中的图片，也可以使用已经上线的图片 URL。'},{title:'保留原有布局',text:'在网页现有尺寸、间距和上下文中观察新图片。'},{title:'只做本地预览',text:'替换仅在浏览器中显示，不会改动网站源文件。'}],
    stepsTitle:'如何替换网页图片', steps:[{title:'选择“更改图片”',text:'在目标网页打开 Edit Page，并从控制面板选择图片工具。'},{title:'选择目标和新图片',text:'点击网页图片，然后上传本地文件或粘贴图片直链。'},{title:'对比最终效果',text:'检查构图和裁切，需要时撤销；刷新页面即可全部恢复。'}],
    useCasesTitle:'常见图片预览场景', useCases:[{title:'营销素材确认',text:'把新 Banner 或活动视觉直接放入落地页中审核。'},{title:'电商陈列',text:'对比不同商品图，并检查裁切在商品列表中的表现。'},{title:'作品集与方案演示',text:'无需重建页面，也能制作可信的前后对比效果。'}],
    noteTitle:'图片替换提示', notes:['尽量选择与原图宽高比接近的图片，预览效果会更真实。','部分视觉是 CSS 背景而非普通图片元素，可能无法直接选中。','浏览器受保护页面不允许插件运行。'],
    faqTitle:'替换网页图片常见问题', faqs:[{question:'可以上传电脑里的图片吗？',answer:'可以，也可以粘贴已经在线的图片直链。'},{question:'网站管理员会看到我的替换吗？',answer:'不会。预览只存在于当前标签页，不会更新网站服务器。'},{question:'为什么新图片被裁切了？',answer:'网页会保留原来的图片尺寸和样式。选择相近宽高比的图片通常会更贴合。'}]
  },
  'remove-elements-from-webpage': {
    ...pages.en['remove-elements-from-webpage'], title:'临时移除网页元素 — Edit Page 浏览器插件', description:'一键隐藏网页中的广告条、侧栏、弹窗或其他干扰元素，用于干净截图、布局对比和演示。',
    eyebrow:'移除网页元素', heading:'一键清理网页中的干扰内容', intro:'临时隐藏当前页面中的任意可选区域，让截图更干净、评审更聚焦，也可以快速比较移除某个模块后的布局效果。', cta:'安装 Edit Page', secondaryCta:'查看完整教程',
    benefitsTitle:'减少干扰，突出重点', benefits:[{title:'指向并点击移除',text:'开启工具后，直接点击想隐藏的可见元素。'},{title:'快速比较布局',text:'移除横幅、卡片、导航或侧栏，观察更简洁的页面结构。'},{title:'随时恢复',text:'使用撤销找回最近移除的内容，或刷新标签页完全还原。'}],
    stepsTitle:'如何移除网页元素', steps:[{title:'选择“移除元素”',text:'打开 Edit Page，在控制面板中启用移除工具。'},{title:'确认选中范围',text:'移动鼠标，预览当前将要移除的是哪一层元素。'},{title:'点击完成',text:'点击后该元素会在本地隐藏，需要恢复时撤销或刷新页面。'}],
    useCasesTitle:'什么时候适合清理页面', useCases:[{title:'制作干净截图',text:'截图前移除 Cookie 提示、悬浮客服或无关内容。'},{title:'设计评审',text:'在会议中即时对比保留和移除某个组件的效果。'},{title:'准备演示材料',text:'减少视觉噪音，让示例网页更好地服务于演示主题。'}],
    noteTitle:'移除只是临时效果', notes:['Edit Page 只会在当前标签页隐藏选中元素，不会删除网站的真实内容。','有些区域由多层嵌套元素组成，选中范围不合适时可以撤销后重新选择。','浏览器受保护页面禁止插件注入。'],
    faqTitle:'移除网页元素常见问题', faqs:[{question:'移除元素会破坏网站吗？',answer:'不会改动真实网站。复杂页面可能暂时改变布局，但刷新即可恢复原状。'},{question:'可以撤销吗？',answer:'可以使用 Edit Page 的撤销功能，也可以刷新页面重置全部本地修改。'},{question:'弹窗和横幅也能移除吗？',answer:'大多数普通网页元素都可以；受保护内容或跨域嵌入区域可能无法选择。'}]
  },
  'full-page-screenshot': {
    ...pages.en['full-page-screenshot'], title:'网页整页截图工具 — Edit Page 浏览器插件', description:'截取当前视窗或从顶部到底部保存完整网页。可在编辑文字、替换图片、移除元素后直接生成长截图。',
    eyebrow:'网页整页截图', heading:'不只截屏幕，保存完整网页', intro:'截取当前可见区域，或让 Edit Page 自动滚动并拼接整个长页面。还可以先完成文字、图片和元素调整，再输出用于评审的完整视觉稿。', cta:'安装 Edit Page', secondaryCta:'查看完整教程',
    benefitsTitle:'从快速截屏到完整页面留档', benefits:[{title:'两种截图模式',text:'保存当前视窗，或从顶部到底部截取完整滚动页面。'},{title:'连同修改一起保存',text:'先编辑文字、替换图片和清理干扰内容，再生成截图。'},{title:'数据保留在本地',text:'截图在本机生成，并通过浏览器直接下载。'}],
    stepsTitle:'如何截取完整网页', steps:[{title:'准备好页面',text:'完成需要的本地修改，并等待图片和字体加载完毕。'},{title:'选择“截图”',text:'打开控制面板，选择“当前视窗”或“整页截图”。'},{title:'等待生成完成',text:'保持标签页可见，让 Edit Page 自动滚动、拼接并准备下载。'}],
    useCasesTitle:'完整网页截图适合什么场景', useCases:[{title:'网站质量检查',text:'在内容或视觉评审后，用一张连续图片记录完整页面。'},{title:'竞品研究',text:'保存公开落地页或产品体验在某个时间点的视觉资料。'},{title:'客户确认',text:'将临时修改的文案和图片一起输出为整洁的完整方案图。'}],
    noteTitle:'让长截图更流畅', notes:['截图滚动与拼接过程中请保持当前标签页处于活动状态。','吸顶导航、懒加载内容、动画或无限滚动页面可能影响结果。','只需要屏幕可见区域时，请选择“当前视窗”。'],
    faqTitle:'整页截图常见问题', faqs:[{question:'当前视窗和整页截图有什么区别？',answer:'当前视窗只保存屏幕可见部分；整页截图会自动滚动并捕获整个页面。'},{question:'可以把我修改后的页面截下来吗？',answer:'可以。临时修改的文字、图片和元素状态都会包含在截图中。'},{question:'为什么吸顶导航重复出现？',answer:'部分固定或动画元素会在长截图滚动时重复。截图前临时移除该元素通常能得到更干净的结果。'}]
  }
};

export const LANDING_SLUGS = Object.keys(pages.en) as LandingSlug[];
export const getLandingPage = (lang: LandingLang, slug: LandingSlug) => pages[lang][slug];
