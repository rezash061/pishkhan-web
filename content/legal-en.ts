import type { LegalDoc } from "./types";
import { company } from "./site";

// English versions of the privacy policy and the data deletion instructions, for Meta app review and other
// non-Persian readers. They describe what the product actually does (checked against the backend); keep them in step
// with the Persian texts in legal.ts. Like those, they must be reviewed by a lawyer before public launch.

const UPDATED = "2026-11-15T00:00:00Z";
const EMAIL = company.email;

export const legalDocsEn: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "What Pishkhan collects, why, who processes it, how long it is kept and how to have it deleted.",
    version: "1.0",
    updatedAt: UPDATED,
    body: [
      { type: "p", text: "Pishkhan (\"we\", \"us\") is a customer-messaging assistant for online sellers. It helps a business answer the Instagram direct messages and comments its own customers send it, take orders and check payment receipts. This policy explains what data we process, why, and the choices you and your customers have. The [Persian version](/privacy) of this policy has the same meaning." },
      { type: "callout", tone: "info", text: "**In short:** we only process messages that customers send to a business that has connected its own Instagram account to Pishkhan. We use that data only to provide the service to that business. We never sell it, never use it for advertising, never ask for Instagram passwords and never message people who have not messaged the business first." },

      { type: "h2", text: "1. Who this policy covers", id: "scope" },
      { type: "ul", items: [
        "**Sellers:** businesses and their team members who create a Pishkhan account.",
        "**Customers:** people who message or comment on a seller's Instagram account (or another connected channel) and whose messages Pishkhan processes for that seller.",
      ] },
      { type: "p", text: "For customers' messages, the seller decides why the conversation exists and Pishkhan processes it on the seller's behalf and on the seller's instructions." },

      { type: "h2", text: "2. Data we receive from Instagram (Meta)", id: "instagram-data" },
      { type: "p", text: "A seller connects a **professional (Business or Creator) Instagram account** through Instagram's official login and explicitly approves the access. We use the Instagram API with Instagram Login and request only these permissions:" },
      { type: "ul", items: [
        "**instagram_business_basic:** the account's ID, username and profile details, and its posts and reels, so the seller can set rules for specific posts.",
        "**instagram_business_manage_messages:** to receive the direct messages customers send to the account and to send replies to those customers.",
        "**instagram_business_manage_comments:** to read comments on the account's own posts and reply to them.",
      ] },
      { type: "p", text: "From this access we store: the account's ID and username, an access token (encrypted), the messages and comments customers send to the account and the replies sent back, the customer's Instagram-scoped ID, username and display name, and media customers send in a conversation (for example a photo of a payment receipt)." },
      { type: "p", text: "We **never** ask for or store Instagram passwords. We do not access personal (non-professional) accounts, we do not follow, like or post on anyone's behalf, and we only reply within the messaging rules Meta sets (for example, its 24-hour messaging window). We do not message people who have not contacted the business." },

      { type: "h2", text: "3. Data sellers give us", id: "account-data" },
      { type: "ul", items: [
        "Mobile number, used for sign-in with one-time codes and for service notifications.",
        "Business name, team members and their roles, and settings.",
        "Business content the seller enters: products, prices, stock, shipping terms, FAQs and the assistant's instructions.",
        "Bank card or Sheba numbers the seller registers to receive card-to-card payments, used only to check customers' receipts against them.",
        "Subscription payments, made through a licensed payment gateway. We do not see or store full card numbers or card security codes.",
      ] },

      { type: "h2", text: "4. Data about customers created in the service", id: "customer-data" },
      { type: "p", text: "While serving a seller, Pishkhan may record a customer's orders, delivery address, and phone number (only when the customer gives it, after being asked for consent). It may also record details read from a payment receipt the customer sends (amount, date, reference number, and the masked card numbers as printed), plus tags and notes the seller's team adds." },

      { type: "h2", text: "5. How we use data", id: "use" },
      { type: "ul", items: [
        "To provide the service to the seller: show conversations in the seller's inbox, generate and send replies, take orders, create payment links, check receipts and hand conversations to a human.",
        "To keep the service secure and working: prevent abuse, detect malware in files, debug problems and measure performance.",
        "To bill the seller for their plan and usage.",
        "To communicate with sellers about their account and the service.",
      ] },
      { type: "p", text: "We **do not** sell personal data, use it for advertising or profiling, share it with data brokers, or use one seller's customer data for another seller." },

      { type: "h2", text: "6. How AI is used", id: "ai" },
      { type: "p", text: "To draft a reply, the customer's message, recent conversation history and the seller's business information are sent to a language model. Images and voice notes may be processed by a vision or speech model, for example to read a payment receipt or transcribe a voice note. The models only answer from the seller's own information. The seller can review AI behaviour, turn automatic replies off, and hand any conversation to a human." },
      { type: "p", text: "We use self-hosted models or providers that process data only to return a result to us and do not use it to train their models. We do not use sellers' or customers' data to train general-purpose models." },

      { type: "h2", text: "7. Who processes data for us", id: "processors" },
      { type: "p", text: "We share data only with service providers that help us run Pishkhan, only as far as each one needs, and under contracts or terms that require them to protect it:" },
      { type: "ul", items: [
        "**Meta (Instagram):** to receive and send the seller's messages.",
        "**Hosting and infrastructure providers:** the servers and storage the service runs on.",
        "**AI model providers:** as described in section 6.",
        "**SMS and messaging providers:** for sign-in codes and notifications, and messages a seller sends to its own customers through other connected channels.",
        "**Payment gateways:** for our subscription payments and, when a seller enables them, payment links that pay the seller directly. We never hold the seller's customers' money.",
      ] },
      { type: "p", text: "We may disclose data when required by applicable law or a valid legal order, and we will tell the affected seller unless we are not allowed to." },

      { type: "h2", text: "8. Where data is stored and how it is protected", id: "security" },
      { type: "ul", items: [
        "The main database and files are hosted on servers in Iran. The components that exchange messages with Meta, and some AI providers, may run on servers outside Iran.",
        "Data is encrypted in transit (TLS). Access tokens and sensitive fields such as customers' phone numbers and addresses are also encrypted at rest.",
        "Every file received is scanned for malware before it is used.",
        "Phone numbers, card numbers and tokens are masked in logs.",
        "Staff access is limited to what their role needs, requires two-factor authentication, and is recorded in an audit log.",
      ] },

      { type: "h2", text: "9. How long we keep data", id: "retention" },
      { type: "ul", items: [
        "Conversations and messages: for the period the seller's plan includes (12 months by default), or until the seller or the customer has them deleted.",
        "Payment receipts and their checks: 24 months.",
        "When a seller deletes their account, their data is deleted after a 30-day grace period (in case of a mistake), and removed from backups within 90 days after that.",
        "Billing and invoice records: as long as tax and accounting law requires.",
      ] },

      { type: "h2", text: "10. Your choices and rights", id: "rights" },
      { type: "ul", items: [
        "Sellers can view, correct, export and delete their data in the panel, disconnect Instagram at any time, and delete their account.",
        "Customers can ask the seller they talked to, or us directly, to access or delete the data held about them.",
        "Anyone can remove Pishkhan's access from Instagram's settings, which sends us a deletion request automatically. See [Data deletion instructions](/en/data-deletion).",
      ] },

      { type: "h2", text: "11. Children", id: "children" },
      { type: "p", text: "Pishkhan is a business tool and is not meant for children. Seller accounts must be opened by adults." },

      { type: "h2", text: "12. Changes to this policy", id: "changes" },
      { type: "p", text: "We will post any change on this page and update the date above. Sellers will be told about significant changes through the panel and by SMS at least 10 days before they take effect." },

      { type: "h2", text: "13. Contact", id: "contact" },
      { type: "p", text: `For any privacy question or request, email [${EMAIL}](mailto:${EMAIL}).` },
    ],
  },
  {
    slug: "data-deletion",
    title: "Data Deletion Instructions",
    description: "How to remove Pishkhan's access to Instagram and have your data deleted.",
    version: "1.0",
    updatedAt: UPDATED,
    body: [
      { type: "p", text: "Sellers, and any Instagram user who has talked to a business through Pishkhan, can have their data deleted. When a request is processed, the conversations, messages and contact details linked to that Instagram account are removed from Pishkhan." },
      { type: "h2", text: "Option 1: from Instagram's settings", id: "instagram" },
      { type: "ol", items: [
        "Open Instagram and go to your profile.",
        "Tap the menu (☰) and open **Settings and activity**.",
        "Open **Website permissions**, then **Apps and websites**.",
        "Find Pishkhan under **Active** and tap **Remove**.",
        "Instagram then sends us a deletion request automatically and shows you a confirmation code. You can check its status on our [status page](/data-deletion#status).",
      ] },
      { type: "h2", text: "Option 2: from the Pishkhan panel (sellers)", id: "panel" },
      { type: "p", text: "Go to **Channels** and disconnect Instagram. To delete the whole account and all its data, use **Settings → Delete account**." },
      { type: "h2", text: "Option 3: email us", id: "email" },
      { type: "p", text: `Email your Instagram username to [${EMAIL}](mailto:${EMAIL}) and ask for deletion. To confirm you own the account, we may ask you to send us a message from it.` },
      { type: "callout", tone: "info", text: "Deletion usually finishes within a few hours and always within 30 days." },
    ],
  },
];

export function getLegalDocEn(slug: string): LegalDoc {
  const doc = legalDocsEn.find((d) => d.slug === slug);
  if (!doc) {
    throw new Error(`Unknown English legal document: ${slug}`);
  }
  return doc;
}
