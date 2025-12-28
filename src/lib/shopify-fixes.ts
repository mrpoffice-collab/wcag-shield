/**
 * Shopify DIY Fix Instructions
 *
 * Plain-language instructions for store owners to fix accessibility issues.
 * Written for people who can build a Shopify store but aren't developers.
 */

export interface ShopifyFix {
  id: string;
  title: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  timeToFix: string;
  difficulty: 'easy' | 'medium' | 'hard';
  summary: string;
  whyItMatters: string;
  steps: {
    location: string;
    instructions: string[];
    tip?: string;
  }[];
  examples: {
    before: string;
    after: string;
    explanation: string;
  }[];
  cantFix?: string; // When they need a developer
}

export const SHOPIFY_FIXES: Record<string, ShopifyFix> = {
  'image-alt': {
    id: 'image-alt',
    title: 'Add Alt Text to Images',
    severity: 'critical',
    timeToFix: '2-5 minutes per image',
    difficulty: 'easy',
    summary: 'Images need descriptions so screen readers can tell blind users what\'s in the picture.',
    whyItMatters: 'Blind and low-vision users use screen readers that read alt text aloud. Without it, they hear "image" with no context. This is the #1 reason stores get ADA lawsuits.',
    steps: [
      {
        location: 'Product Images',
        instructions: [
          'Go to Products in your Shopify admin',
          'Click on a product',
          'Click on any product image',
          'Find the "Alt text" field below the image',
          'Type a description of what\'s in the image',
          'Click Save'
        ],
        tip: 'Describe what you see: "Red running shoes with white laces, side view" not just "shoes"'
      },
      {
        location: 'Theme Images (banners, logos)',
        instructions: [
          'Go to Online Store → Themes',
          'Click Customize on your active theme',
          'Click on any image section (banner, slideshow, etc.)',
          'Look for "Image alt text" or "Alt text" field',
          'Add a description',
          'Click Save'
        ],
        tip: 'For your logo, use your store name as alt text'
      },
      {
        location: 'Blog Post Images',
        instructions: [
          'Go to Online Store → Blog posts',
          'Edit the blog post',
          'Click on the image in the content editor',
          'Click the image icon or "Edit image"',
          'Find the Alt text field',
          'Add a description',
          'Save the post'
        ]
      }
    ],
    examples: [
      {
        before: '(no alt text)',
        after: 'Woman wearing oversized beige sweater, front view',
        explanation: 'Describe the product clearly so someone who can\'t see it understands what\'s shown'
      },
      {
        before: 'IMG_4523.jpg',
        after: 'Handmade ceramic coffee mug with blue glaze',
        explanation: 'File names are not descriptions. Write what a person would see.'
      },
      {
        before: 'product photo',
        after: 'Organic lavender soap bar with dried flower petals on top',
        explanation: 'Be specific. Generic text doesn\'t help anyone.'
      }
    ]
  },

  'button-name': {
    id: 'button-name',
    title: 'Fix Buttons Without Names',
    severity: 'critical',
    timeToFix: '5-15 minutes',
    difficulty: 'medium',
    summary: 'Buttons need text or labels so screen readers can announce what the button does.',
    whyItMatters: 'When a button has no name, screen reader users hear "button" with no idea what it does. They can\'t shop your store.',
    steps: [
      {
        location: 'Theme Customizer (most common fix)',
        instructions: [
          'Go to Online Store → Themes',
          'Click Customize',
          'Look for icon-only buttons (cart icon, search icon, menu icon)',
          'Click on the section containing the button',
          'Look for "Accessibility label" or "Button text" setting',
          'Add descriptive text like "Open cart" or "Search"',
          'Click Save'
        ],
        tip: 'Many modern themes have accessibility label options built in. Check your theme settings first.'
      },
      {
        location: 'If no setting exists (requires code)',
        instructions: [
          'Go to Online Store → Themes',
          'Click Actions → Edit code',
          'Search for the button in your theme files',
          'Add aria-label="Description" to the button tag',
          'Save the file'
        ],
        tip: 'Example: <button aria-label="Add to cart"><svg>...</svg></button>'
      }
    ],
    examples: [
      {
        before: '<button><svg class="cart-icon"></svg></button>',
        after: '<button aria-label="Open shopping cart"><svg class="cart-icon"></svg></button>',
        explanation: 'Icon-only buttons need aria-label to describe their purpose'
      },
      {
        before: '<button>+</button>',
        after: '<button aria-label="Increase quantity">+</button>',
        explanation: 'Symbols like + and - need labels explaining what they do'
      }
    ],
    cantFix: 'If buttons are inside Shopify apps (not your theme), contact the app developer to fix them.'
  },

  'link-name': {
    id: 'link-name',
    title: 'Fix Links Without Text',
    severity: 'serious',
    timeToFix: '5-10 minutes',
    difficulty: 'medium',
    summary: 'Links need text describing where they go. Icon-only links need labels.',
    whyItMatters: 'Screen reader users navigate by links. If a link has no text, they hear "link" with no idea where it goes.',
    steps: [
      {
        location: 'Social Media Icons',
        instructions: [
          'Go to Online Store → Themes → Customize',
          'Find your footer or social media section',
          'Look for "Accessibility" or "Screen reader text" options',
          'Add labels like "Facebook", "Instagram", etc.',
          'Save changes'
        ],
        tip: 'Most themes let you add social link labels without code'
      },
      {
        location: 'Navigation Links',
        instructions: [
          'Go to Online Store → Navigation',
          'Check each menu for descriptive link names',
          'Avoid generic text like "Click here" or "Read more"',
          'Use specific text like "View our return policy"'
        ]
      },
      {
        location: 'Image Links (requires code)',
        instructions: [
          'Go to Themes → Edit code',
          'Find links that only contain images',
          'Add aria-label to the link tag',
          'Save the file'
        ]
      }
    ],
    examples: [
      {
        before: '<a href="/facebook"><svg>...</svg></a>',
        after: '<a href="/facebook" aria-label="Follow us on Facebook"><svg>...</svg></a>',
        explanation: 'Social media icon links need labels'
      },
      {
        before: 'Click here to learn more',
        after: 'Read our shipping policy',
        explanation: 'Link text should describe the destination, not the action of clicking'
      }
    ]
  },

  'label': {
    id: 'label',
    title: 'Add Labels to Form Fields',
    severity: 'critical',
    timeToFix: '10-20 minutes',
    difficulty: 'medium',
    summary: 'Every text box, dropdown, and checkbox needs a visible label or accessible name.',
    whyItMatters: 'Screen reader users can\'t tell what information to enter if fields have no labels. Placeholder text disappears when typing and isn\'t announced by all screen readers.',
    steps: [
      {
        location: 'Newsletter Signup Forms',
        instructions: [
          'Go to Online Store → Themes → Customize',
          'Find your newsletter/email signup section',
          'Look for "Show label" option and enable it',
          'Or add aria-label in theme settings if available',
          'Save changes'
        ],
        tip: 'If your theme hides labels for design reasons, ask your theme developer to add aria-labels'
      },
      {
        location: 'Contact Forms',
        instructions: [
          'If using a Shopify app for forms, check the app settings for label options',
          'Enable visible labels where possible',
          'If labels can\'t be shown, ensure aria-label is set'
        ]
      },
      {
        location: 'Checkout (Limited Control)',
        instructions: [
          'Shopify controls most of the checkout',
          'For Shopify Plus: You can customize checkout.liquid',
          'For regular Shopify: Checkout is mostly accessible by default'
        ]
      }
    ],
    examples: [
      {
        before: '<input type="email" placeholder="Enter your email">',
        after: '<label for="email">Email address</label>\n<input type="email" id="email" placeholder="Enter your email">',
        explanation: 'Add a visible label above the field'
      },
      {
        before: '<input type="email" placeholder="Email">',
        after: '<input type="email" aria-label="Email address" placeholder="Email">',
        explanation: 'If you can\'t show a label, use aria-label (but visible labels are better)'
      }
    ],
    cantFix: 'Forms inside third-party apps need to be fixed by the app developer. Contact them.'
  },

  'html-has-lang': {
    id: 'html-has-lang',
    title: 'Set Page Language',
    severity: 'serious',
    timeToFix: '2 minutes',
    difficulty: 'easy',
    summary: 'Your store needs to declare what language it\'s in so screen readers pronounce words correctly.',
    whyItMatters: 'Screen readers use the language setting to pronounce words correctly. Without it, a French screen reader might try to read English text with French pronunciation.',
    steps: [
      {
        location: 'Theme Settings',
        instructions: [
          'Go to Online Store → Themes',
          'Click Actions → Edit code',
          'Open the theme.liquid file (in Layout folder)',
          'Find the <html> tag near the top',
          'Make sure it says <html lang="en"> (or your language code)',
          'If lang is missing, add it: <html lang="en">',
          'Save the file'
        ],
        tip: 'Language codes: en=English, es=Spanish, fr=French, de=German, etc.'
      }
    ],
    examples: [
      {
        before: '<html>',
        after: '<html lang="en">',
        explanation: 'Add the lang attribute with your store\'s language'
      },
      {
        before: '<html class="no-js">',
        after: '<html lang="en" class="no-js">',
        explanation: 'Keep existing attributes, just add lang'
      }
    ]
  },

  'heading-order': {
    id: 'heading-order',
    title: 'Fix Heading Order',
    severity: 'moderate',
    timeToFix: '10-30 minutes',
    difficulty: 'medium',
    summary: 'Headings should go in order (H1, then H2, then H3). Don\'t skip levels.',
    whyItMatters: 'Screen reader users navigate by headings like a table of contents. Skipping from H1 to H4 is confusing - it suggests missing content.',
    steps: [
      {
        location: 'Theme Customizer',
        instructions: [
          'Go to Online Store → Themes → Customize',
          'Look at each section\'s heading settings',
          'Ensure H1 is used only once (usually your store name or page title)',
          'Section headings should be H2',
          'Sub-sections should be H3',
          'Don\'t skip from H2 to H4'
        ],
        tip: 'Many themes let you choose heading levels in section settings'
      },
      {
        location: 'Product Descriptions & Blog Posts',
        instructions: [
          'When writing content, use the formatting toolbar',
          'Use Heading 2 for main sections',
          'Use Heading 3 for subsections',
          'Don\'t use headings just to make text big - use them for structure'
        ]
      },
      {
        location: 'Theme Code (if needed)',
        instructions: [
          'Go to Themes → Edit code',
          'Search for <h3>, <h4>, <h5>, <h6> tags',
          'Check if they follow a logical order',
          'Adjust heading levels as needed',
          'Save files'
        ]
      }
    ],
    examples: [
      {
        before: 'H1 → H3 → H4 (skipped H2)',
        after: 'H1 → H2 → H3',
        explanation: 'Don\'t skip heading levels'
      },
      {
        before: 'Multiple H1 tags on one page',
        after: 'One H1, rest are H2-H6',
        explanation: 'Only one H1 per page - it\'s your main page title'
      }
    ]
  },

  'empty-heading': {
    id: 'empty-heading',
    title: 'Remove or Fill Empty Headings',
    severity: 'minor',
    timeToFix: '5-10 minutes',
    difficulty: 'easy',
    summary: 'Headings with no text confuse screen readers. Either add text or remove the heading.',
    whyItMatters: 'Screen readers announce "heading level 2" but then read nothing. Users think content is missing or broken.',
    steps: [
      {
        location: 'Theme Customizer',
        instructions: [
          'Go to Online Store → Themes → Customize',
          'Check each section for empty heading fields',
          'Either add text or look for "Hide heading" option',
          'If a heading shows but is empty, fill it in or hide the section',
          'Save changes'
        ]
      },
      {
        location: 'Theme Code',
        instructions: [
          'Go to Themes → Edit code',
          'Search for empty heading tags like <h2></h2>',
          'Either add content or remove the empty tags',
          'Save files'
        ]
      }
    ],
    examples: [
      {
        before: '<h2></h2>',
        after: '<h2>Featured Products</h2>',
        explanation: 'Add meaningful text'
      },
      {
        before: '<h2></h2>',
        after: '(remove the empty heading entirely)',
        explanation: 'Or just delete it if you don\'t need a heading there'
      }
    ]
  },

  'document-title': {
    id: 'document-title',
    title: 'Add Page Titles',
    severity: 'serious',
    timeToFix: '5 minutes',
    difficulty: 'easy',
    summary: 'Every page needs a title that appears in the browser tab and describes the page content.',
    whyItMatters: 'Screen reader users rely on page titles to know where they are. It\'s also important for SEO and bookmarking.',
    steps: [
      {
        location: 'Product Pages',
        instructions: [
          'Go to Products',
          'Edit a product',
          'Scroll to "Search engine listing"',
          'Click "Edit website SEO"',
          'Fill in the "Page title" field',
          'Save'
        ],
        tip: 'Format: Product Name | Your Store Name'
      },
      {
        location: 'Collection Pages',
        instructions: [
          'Go to Products → Collections',
          'Edit a collection',
          'Scroll to "Search engine listing"',
          'Fill in the "Page title"',
          'Save'
        ]
      },
      {
        location: 'Other Pages',
        instructions: [
          'Go to Online Store → Pages',
          'Edit the page',
          'Scroll to "Search engine listing"',
          'Fill in the "Page title"',
          'Save'
        ]
      },
      {
        location: 'Homepage',
        instructions: [
          'Go to Online Store → Preferences',
          'Fill in "Homepage title"',
          'Save'
        ]
      }
    ],
    examples: [
      {
        before: '(no title)',
        after: 'Organic Cotton T-Shirts | EcoWear Store',
        explanation: 'Include product/page name and store name'
      },
      {
        before: 'Home',
        after: 'EcoWear - Sustainable Fashion & Organic Clothing',
        explanation: 'Homepage should describe your store'
      }
    ]
  },

  'table-header': {
    id: 'table-header',
    title: 'Add Headers to Data Tables',
    severity: 'serious',
    timeToFix: '10-15 minutes',
    difficulty: 'medium',
    summary: 'Tables with data need header cells (<th>) so screen readers can announce what each column/row contains.',
    whyItMatters: 'Without headers, screen reader users hear a list of values with no context. They can\'t tell that "Red" is a color and "Large" is a size.',
    steps: [
      {
        location: 'Size Charts',
        instructions: [
          'If using an app for size charts, check its accessibility settings',
          'Many size chart apps let you mark header rows',
          'Enable headers for the first row (sizes) and first column (measurements)'
        ]
      },
      {
        location: 'Custom Tables in Content',
        instructions: [
          'When adding tables in product descriptions or pages',
          'Use the table editor\'s header row option if available',
          'Or edit the HTML to use <th> for headers instead of <td>'
        ]
      },
      {
        location: 'Theme Code',
        instructions: [
          'Go to Themes → Edit code',
          'Find tables in your theme files',
          'Change the first row from <td> to <th>',
          'Add scope="col" for column headers',
          'Add scope="row" for row headers',
          'Save files'
        ]
      }
    ],
    examples: [
      {
        before: '<tr><td>Size</td><td>Chest</td><td>Length</td></tr>',
        after: '<tr><th scope="col">Size</th><th scope="col">Chest</th><th scope="col">Length</th></tr>',
        explanation: 'Use <th> with scope for header cells'
      }
    ],
    cantFix: 'Tables generated by apps need to be fixed by the app developer.'
  }
};

// Get fix instructions for a specific issue
export function getFixInstructions(issueId: string): ShopifyFix | null {
  return SHOPIFY_FIXES[issueId] || null;
}

// Get all fixes sorted by severity
export function getAllFixes(): ShopifyFix[] {
  const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  return Object.values(SHOPIFY_FIXES).sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );
}

// Get fixes by difficulty
export function getFixesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ShopifyFix[] {
  return Object.values(SHOPIFY_FIXES).filter(fix => fix.difficulty === difficulty);
}
