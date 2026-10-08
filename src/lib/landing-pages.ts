export type LandingSlug = 'edit-text-on-webpage' | 'replace-images-on-webpage' | 'remove-elements-from-webpage' | 'full-page-screenshot';
export type LandingLang = 'en' | 'zh';

export interface LandingGuideSection {
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  screenshot: {
    id: string;
    title: string;
    brief: string;
    alt: string;
    src?: string;
  };
}

export interface LandingGuide {
  updated: string;
  authorLabel: string;
  introTitle: string;
  introText: string;
  sections: LandingGuideSection[];
  quotaTitle: string;
  quotaText: string;
}

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
  guide?: LandingGuide;
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
        { question: 'Can I edit text inside a link?', answer: 'Usually yes. If the link opens when clicked, enter edit mode on nearby text and move the caret with the keyboard arrow keys.' },
        { question: 'Can I format only part of a sentence?', answer: 'Yes. Select the exact words you want to change, then use the Text formatting toolbar. Formatting applies only to the selected text.' },
        { question: 'Are text edits limited on the free plan?', answer: 'Typing and editing text are not limited. The free plan includes 30 Text formatting actions; using that allowance locks advanced features for 12 hours.' }
      ],
      guide: {
        updated: 'Updated October 8, 2026',
        authorLabel: 'Product guide by Henri Z.',
        introTitle: 'Edit words, then format the exact text you selected',
        introText: 'Edit Page has two complementary text workflows. Edit text turns the page body into an editable surface with its own history controls. When you select words, the optional Text formatting toolbar lets you change their appearance without restyling the surrounding element.',
        sections: [
          {
            eyebrow: 'Edit text',
            title: 'Type directly in the page and keep every change reversible',
            text: 'Choose Edit text from the Popup, click visible copy, and type in place. A page-level history toolbar stays available while you work, showing Undo, Redo, Done, the change count, and editing guidance.',
            points: [
              'Continuous typing in the same element is grouped into a useful history step instead of one step per keystroke.',
              'Undo and Redo move through text edits and formatting changes in order.',
              'Choose Done when the mockup is ready, or refresh the tab to restore the original webpage.'
            ],
            screenshot: {
              id: 'edit-text-mode',
              src: '/guides/edit-text-mode.webp',
              title: 'Edit text mode and history toolbar',
              brief: 'Capture a normal webpage while Edit text is active, with an edited headline and the history toolbar visible.',
              alt: 'Edit Page editing webpage text in place with the Undo, Redo and Done history toolbar visible'
            }
          },
          {
            eyebrow: 'Text formatting toolbar',
            title: 'Format only the words you select',
            text: 'With “Show toolbar when text is selected” enabled in Settings, selecting non-empty text opens the Text formatting toolbar near the selection. It moves below the selection when there is not enough space above.',
            points: [
              'Decrease or increase font size, with the current size shown between the controls; mixed selections display Mixed.',
              'Apply bold, strikethrough, italic, underline, text color, or background color.',
              'Reset a color or restore the selected text to its original formatting without changing nearby copy.'
            ],
            screenshot: {
              id: 'text-formatting-toolbar',
              src: '/guides/text-formatting-toolbar.webp',
              title: 'Selected text with formatting controls',
              brief: 'Select part of a sentence and capture the full Text formatting toolbar, including the color panel if possible.',
              alt: 'Text formatting toolbar above selected webpage text with font size, bold, strikethrough, italic, underline and color controls'
            }
          },
          {
            eyebrow: 'Settings and limits',
            title: 'Keep the toolbar optional and understand the free allowance',
            text: 'The toolbar is enabled by default. Turn off “Show toolbar when text is selected” under Settings → Edit text when you want a distraction-free typing workflow.',
            points: [
              'Editing and typing text do not consume the Text formatting allowance.',
              'The free plan includes 30 toolbar actions, including font-size and reset actions.',
              'Premium removes the formatting allowance; Undo and Redo never consume it.'
            ],
            screenshot: {
              id: 'edit-text-settings',
              src: '/guides/edit-text-settings.webp',
              title: 'Edit text settings and usage',
              brief: 'Capture Settings → Edit text with the toolbar switch and Text formatting usage visible.',
              alt: 'Edit Page Settings showing the Show toolbar when text is selected switch and Text formatting allowance'
            }
          }
        ],
        quotaTitle: 'Free-plan behavior',
        quotaText: 'Edit text itself is free to use. Text formatting includes 30 toolbar actions per allowance period. When any advanced-feature allowance is exhausted, advanced features are locked for 12 hours and the counters reset when the lock ends.'
      }
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
        { question: 'Why does an image look cropped?', answer: 'Keep the original size and crop preserves the existing box and fills it with the new image. Choose Use the new image’s size in Settings when you want the page to use the replacement image’s own dimensions.' },
        { question: 'Can I resize an image after replacing it?', answer: 'Yes. A replaced image gets eight resize handles. Drag a corner to keep its aspect ratio, drag an edge to change one direction, or hold Alt to reverse that behavior.' },
        { question: 'Does resizing use another free replacement?', answer: 'No. The free allowance is counted when you import a local image or Image URL. Resizing, Undo, and Redo do not consume it.' }
      ],
      guide: {
        updated: 'Updated October 8, 2026',
        authorLabel: 'Product guide by Henri Z.',
        introTitle: 'Import an image, control its fit, then resize it on the page',
        introText: 'Change image is more than a one-click swap. You can import a local file or Image URL, choose how replacements affect layout, and adjust a replaced image with handles directly on the webpage.',
        sections: [
          {
            eyebrow: 'Local file or Image URL',
            title: 'Use the source that fits your workflow',
            text: 'Upload an image from your computer or paste an http or https Image URL. Edit Page checks that a URL can load as an image before it saves the source or shows a preview.',
            points: [
              'Failed URLs are rejected instead of leaving a broken image in the preview.',
              'The URL may fail when the file is missing, is not an image, times out, or the host blocks cross-site access.',
              'One import counts once, even when you use that imported image on several elements.'
            ],
            screenshot: {
              id: 'change-image-source',
              src: '/guides/change-image-source.webp',
              title: 'Change image mode on a live webpage',
              brief: 'A replacement image selected on the page while Change image remains active in the Popup.',
              alt: 'Edit Page replacing an image directly on a live webpage while Change image mode is active'
            }
          },
          {
            eyebrow: 'After replacing an image',
            title: 'Choose whether the page keeps its frame or follows the new image',
            text: 'Settings → Change image controls the default behavior for every replacement. Pick the layout-preserving option for quick mockups, or let the replacement use its own dimensions when the new asset should reshape the page.',
            points: [
              'Keep the original size and crop preserves the original box and uses a cover-style crop.',
              'Use the new image’s size applies the replacement image’s own dimensions and may reflow the page.',
              'The same replacement flow works for regular images and selectable background images.'
            ],
            screenshot: {
              id: 'replace-image-size-setting',
              src: '/guides/replace-image-size-setting.webp',
              title: 'The two replacement-size settings',
              brief: 'Capture Settings → Change image with both “After replacing an image” choices visible.',
              alt: 'Edit Page Settings showing Keep the original size and crop and Use the new image’s size'
            }
          },
          {
            eyebrow: 'Resize after replacement',
            title: 'Drag eight handles without losing a clean Undo history',
            text: 'Immediately after a successful replacement, the changed element receives handles on four corners and four edges. The overlay follows the element as the page scrolls or its size changes.',
            points: [
              'Corner drags keep the aspect ratio by default; edge drags change one direction.',
              'Hold Alt to reverse the current rule, or press Esc while dragging to cancel and restore the starting size.',
              'One completed drag becomes one Undo step. Cancelled or unchanged drags are not added to history.'
            ],
            screenshot: {
              id: 'replace-image-resize-handles',
              src: '/guides/replace-image-resize-handles.webp',
              title: 'A replaced image with all resize handles',
              brief: 'Capture a clearly replaced image selected on the page with all eight resize handles visible.',
              alt: 'A replaced webpage image selected with Edit Page resize handles on its corners and edges'
            }
          }
        ],
        quotaTitle: 'Free-plan behavior',
        quotaText: 'The free plan includes 5 Change image imports. A local upload and an Image URL each count when imported; reusing the image, resizing it, Undo, and Redo do not. Exhausting any advanced-feature allowance locks advanced features for 12 hours.'
      }
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
    faqTitle:'编辑网页文字常见问题', faqs:[{question:'会修改网站上的真实内容吗？',answer:'不会。修改只存在于当前浏览器标签页，不会上传到网站或写入服务器。'},{question:'需要懂 HTML 或开发者工具吗？',answer:'不需要。选择“编辑文字”，点击可见文字后直接输入即可。'},{question:'链接里的文字可以修改吗？',answer:'通常可以。如果点击时发生跳转，请先在附近文字中进入编辑状态，再用方向键移动光标。'},{question:'可以只设置一句话里的部分文字吗？',answer:'可以。准确选中需要修改的文字，再使用文字格式工具栏；格式只会作用于选中的部分。'},{question:'免费版编辑文字有次数限制吗？',answer:'输入和编辑文字本身没有次数限制。免费版包含 30 次文本格式操作；用尽后高级功能会锁定 12 小时。'}],
    guide:{
      updated:'更新于 2026 年 10 月 8 日', authorLabel:'Henri Z. 产品指南',
      introTitle:'先直接改字，再为准确选中的文字设置格式',
      introText:'Edit Page 提供两套互补的文字工作流。“编辑文字”会让页面正文进入可编辑状态，并显示历史工具栏；选中文字后，可选的文字格式工具栏可以只改变选区，而不会连带修改周围整个元素。',
      sections:[
        {eyebrow:'编辑文字',title:'直接在网页原位置输入，每一步都能恢复',text:'在 Popup 中选择“编辑文字”，点击网页上的可见文案后直接输入。工作期间，页面内的历史工具栏会显示撤回、重做、完成、修改计数和操作提示。',points:['同一元素里的连续输入会合并为有意义的一条历史记录，而不是每个按键一步。','撤回和重做会按顺序处理文字修改与文本格式操作。','完成方案后选择“完成”；刷新标签页即可恢复网站原始内容。'],screenshot:{id:'edit-text-mode',src:'/guides/edit-text-mode.webp',title:'编辑文字模式与历史工具栏',brief:'在普通网页中开启“编辑文字”，修改一处标题，并让历史工具栏完整出现在画面里。',alt:'Edit Page 在网页原位置编辑文字，并显示撤回、重做和完成历史工具栏'}},
        {eyebrow:'文字格式工具栏',title:'只为你选中的文字设置格式',text:'在设置中开启“选择文本时显示工具栏”后，选中非空文字就会在附近出现文字格式工具栏；选区上方空间不足时，工具栏会自动显示在下方。',points:['减小或增大字号，中间显示当前字号；混合字号选区显示 Mixed。','支持粗体、删除线、斜体、下划线、文字颜色与背景色。','可以重置颜色或恢复选中文字的原始格式，不影响旁边的文案。'],screenshot:{id:'text-formatting-toolbar',src:'/guides/text-formatting-toolbar.webp',title:'选中文字与完整格式控件',brief:'选中一句话中的部分文字，截到完整文字格式工具栏；如果方便，也展开颜色浮层。',alt:'网页选中文字上方的文字格式工具栏，包含字号、粗体、删除线、斜体、下划线和颜色控件'}},
        {eyebrow:'设置与配额',title:'按需关闭工具栏，并清楚了解免费额度',text:'文字格式工具栏默认开启。如果只想安静地输入文字，可前往“设置 → 编辑文字”关闭“选择文本时显示工具栏”。',points:['输入和编辑文字不会消耗文本格式额度。','免费版包含 30 次工具栏操作，字号调整与重置操作也会计入。','Premium 不受文本格式额度限制；撤回与重做始终不消耗额度。'],screenshot:{id:'edit-text-settings',src:'/guides/edit-text-settings.webp',title:'编辑文字设置与使用量',brief:'截取“设置 → 编辑文字”，画面中同时包含工具栏开关与文本格式使用量。',alt:'Edit Page 设置中的选择文本时显示工具栏开关和文本格式额度'}},
      ],
      quotaTitle:'免费版规则', quotaText:'编辑文字本身可免费使用。文本格式每个额度周期包含 30 次工具栏操作。任意高级功能额度用尽后，全部高级功能锁定 12 小时；锁定结束时计数清零。'
    }
  },
  'replace-images-on-webpage': {
    ...pages.en['replace-images-on-webpage'], title:'直接替换网页图片 — Edit Page 浏览器插件', description:'上传本地图片或粘贴图片 URL，在现有网页中即时预览替换效果，不改动原网站。',
    eyebrow:'替换网页图片', heading:'把新图片放进真实网页里预览', intro:'用本地文件或图片 URL 替换网页上的现有图片，立即检查尺寸、裁切和整体观感。适合广告图、商品图、头像和首屏视觉的快速确认。', cta:'安装 Edit Page', secondaryCta:'查看完整教程',
    benefitsTitle:'实现前先看真实效果', benefits:[{title:'上传或粘贴链接',text:'既可以选择电脑中的图片，也可以使用已经上线的图片 URL。'},{title:'保留原有布局',text:'在网页现有尺寸、间距和上下文中观察新图片。'},{title:'只做本地预览',text:'替换仅在浏览器中显示，不会改动网站源文件。'}],
    stepsTitle:'如何替换网页图片', steps:[{title:'选择“更改图片”',text:'在目标网页打开 Edit Page，并从控制面板选择图片工具。'},{title:'选择目标和新图片',text:'点击网页图片，然后上传本地文件或粘贴图片直链。'},{title:'对比最终效果',text:'检查构图和裁切，需要时撤销；刷新页面即可全部恢复。'}],
    useCasesTitle:'常见图片预览场景', useCases:[{title:'营销素材确认',text:'把新 Banner 或活动视觉直接放入落地页中审核。'},{title:'电商陈列',text:'对比不同商品图，并检查裁切在商品列表中的表现。'},{title:'作品集与方案演示',text:'无需重建页面，也能制作可信的前后对比效果。'}],
    noteTitle:'图片替换提示', notes:['尽量选择与原图宽高比接近的图片，预览效果会更真实。','部分视觉是 CSS 背景而非普通图片元素，可能无法直接选中。','浏览器受保护页面不允许插件运行。'],
    faqTitle:'替换网页图片常见问题', faqs:[{question:'可以上传电脑里的图片吗？',answer:'可以，也可以粘贴已经在线的图片 URL。'},{question:'网站管理员会看到我的替换吗？',answer:'不会。预览只存在于当前标签页，不会更新网站服务器。'},{question:'为什么新图片被裁切了？',answer:'“保持原尺寸并裁剪填满”会保留原有盒子并用新图填满。若希望页面采用新图自己的尺寸，请在设置中选择“使用新图自己的尺寸”。'},{question:'替换后可以直接调整图片大小吗？',answer:'可以。替换后的图片会出现八个调整大小手柄。拖动角点默认保持宽高比，拖动边线默认只改变一个方向，按住 Alt 可反转当前规则。'},{question:'调整大小会再次消耗免费次数吗？',answer:'不会。免费额度在导入本地图片或图片 URL 时计数；调整大小、撤回和重做都不消耗额度。'}],
    guide:{
      updated:'更新于 2026 年 10 月 8 日', authorLabel:'Henri Z. 产品指南',
      introTitle:'导入图片、选择适配方式，再直接在网页上调整大小',
      introText:'“更改图片”不只是一次简单替换。你可以导入本地文件或图片 URL，决定替换后是否保持原布局，并通过手柄直接调整已经替换的图片。',
      sections:[
        {eyebrow:'本地文件或图片 URL',title:'根据素材来源选择导入方式',text:'既可以上传电脑里的图片，也可以粘贴以 http 或 https 开头的图片 URL。保存前，Edit Page 会先确认该 URL 能够作为图片加载。',points:['加载失败的 URL 会被拒绝，不会在预览中留下破损图片。','图片不存在、内容不是图片、请求超时或来源网站限制外链访问时，都可能验证失败。','每次导入计一次；同一张已导入图片随后替换多个元素不会重复计数。'],screenshot:{id:'change-image-source',src:'/guides/change-image-source.webp',title:'在真实网页中开启更改图片',brief:'Popup 保持“更改图片”模式，同时在网页中选中已替换的图片。',alt:'Edit Page 在真实网页中替换图片，Popup 的更改图片模式保持开启'}},
        {eyebrow:'替换图片后',title:'选择保持原框，或让页面跟随新图尺寸',text:'“设置 → 更改图片”决定每次替换的默认行为。快速制作版式预览时可保留原有图片框；需要观察新素材真实尺寸对布局的影响时，则让页面使用新图自己的尺寸。',points:['“保持原尺寸并裁剪填满”保留原盒子，并按 cover 方式填充和裁剪。','“使用新图自己的尺寸”采用替换图片的自身尺寸，页面可能因此重新排版。','同一套替换流程适用于普通图片和能够选中的背景图。'],screenshot:{id:'replace-image-size-setting',src:'/guides/replace-image-size-setting.webp',title:'两种替换尺寸设置',brief:'截取“设置 → 更改图片”，完整显示“替换图片后”的两个选项。',alt:'Edit Page 设置中的保持原尺寸并裁剪填满与使用新图自己的尺寸选项'}},
        {eyebrow:'替换后调整大小',title:'拖动八个手柄，同时保持干净的撤回历史',text:'图片成功替换后，目标元素立即获得四个角点和四条边上的调整大小手柄。页面滚动或元素尺寸变化时，覆盖层会继续贴合。',points:['拖动角点默认保持宽高比；拖动边线默认只改变一个方向。','按住 Alt 可反转当前规则；拖动过程中按 Esc 会取消并恢复开始时的尺寸。','一次完成的拖拽只生成一步撤回；取消或尺寸未变化的拖拽不会进入历史。'],screenshot:{id:'replace-image-resize-handles',src:'/guides/replace-image-resize-handles.webp',title:'替换图片后的八个调整大小手柄',brief:'在网页上替换一张容易辨认的图片，选中它并截到完整的八个调整大小手柄。',alt:'网页中已替换的图片被选中，四个角点和四条边显示 Edit Page 调整大小手柄'}},
      ],
      quotaTitle:'免费版规则', quotaText:'免费版包含 5 次“更改图片”导入。本地上传和图片 URL 都在导入时各计一次；重复使用、调整大小、撤回与重做不计数。任意高级功能额度用尽后，高级功能锁定 12 小时。'
    }
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
