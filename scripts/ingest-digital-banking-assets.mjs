import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SOURCE_DIR = 'C:\\Users\\HP\\Desktop\\DigitalSaathi\\Digital Banking';
const DEST_DIR = path.resolve('public', 'tutorials', 'digital-banking', 'assets');
const MANIFEST_SRC_PATH = path.resolve('src', 'data', 'digitalBankingManifest.json');
const MANIFEST_PUBLIC_PATH = path.resolve(DEST_DIR, 'manifest.json');

// Exact 72 asset definitions according to approved Phase 2.1 mapping
const ASSETS = [
  {
    seq: 1,
    original: '1. Cover Page.png',
    kebab: '01-cover-page.png',
    title: 'डिजिटल बैंकिंग और सुरक्षा गाइड',
    category: '1. Banking का डर दूर करें',
    role: 'Cover / Title',
    componentId: 'bookend-cover'
  },
  {
    seq: 2,
    original: '2. Master Index.png',
    kebab: '02-master-index.png',
    title: 'Master Index — 5-Pillar Curriculum Framework',
    category: '1. Banking का डर दूर करें',
    role: 'Index / Syllabus',
    componentId: 'bookend-index'
  },
  {
    seq: 3,
    original: '3. Digital Banking and Safety Guide.png',
    kebab: '03-digital-banking-and-safety-guide.png',
    title: 'डिजिटल दुनिया मुश्किल नहीं है... सही जानकारी और थोड़ी सावधानी ही सुरक्षा है!',
    category: '1. Banking का डर दूर करें',
    role: 'Manifesto',
    componentId: 'bookend-manifesto'
  },
  {
    seq: 4,
    original: '4. Apprehension in Using Digital banking.png',
    kebab: '04-apprehension-in-using-digital-banking.png',
    title: 'हमारे मन में दो बड़े डर: (1) मुझसे गलती हो जाएगी, (2) अगर मोबाइल खो गया तो?',
    category: '1. Banking का डर दूर करें',
    role: 'Core Lesson',
    componentId: 'lesson-01'
  },
  {
    seq: 5,
    original: '5.Payments of Old Methods.png',
    kebab: '05-payments-of-old-methods.png',
    title: 'भुगतान के तरीकों का इतिहास (वस्तु विनिमय से UPI तक)',
    category: '1. Banking का डर दूर करें',
    role: 'Core Lesson',
    componentId: 'lesson-01'
  },
  {
    seq: 6,
    original: '6. Payment Old methods and Fear.png',
    kebab: '06-payment-old-methods-and-fear.png',
    title: 'पुराने तरीके vs नए तरीके: डर को समझें और दूर करें',
    category: '1. Banking का डर दूर करें',
    role: 'Supporting Infographic',
    componentId: 'lesson-01'
  },
  {
    seq: 7,
    original: '7. Methods of Payments.png',
    kebab: '07-methods-of-payments.png',
    title: 'डिजिटल भुगतान के विभिन्न तरीके एक नज़र में',
    category: '3. Digital Payments & UPI',
    role: 'Reference Poster',
    componentId: 'poster-01'
  },
  {
    seq: 8,
    original: '8. Types of banks.png',
    kebab: '08-types-of-banks.png',
    title: 'कौन सा बैंक आपके लिए बेहतर? (Nationalised, Private, Cooperative, RRB)',
    category: '2. Banking, Savings & Schemes',
    role: 'Core Lesson',
    componentId: 'lesson-02'
  },
  {
    seq: 9,
    original: '9. Types of Bank Accounts.png',
    kebab: '09-types-of-bank-accounts.png',
    title: 'बैंक खाता कितने प्रकार के होते हैं? (Savings, Current, Salary, FD, Minor, Senior Citizen, Jan Dhan)',
    category: '2. Banking, Savings & Schemes',
    role: 'Core Lesson',
    componentId: 'lesson-03'
  },
  {
    seq: 10,
    original: '10. Types of Savings.png',
    kebab: '10-types-of-savings.png',
    title: 'बचत की विभिन्न योजनाएं (Savings, FD, RD, PPF, NSC, SSY, SCSS, Mutual Funds, POMIS)',
    category: '2. Banking, Savings & Schemes',
    role: 'Core Lesson',
    componentId: 'lesson-04'
  },
  {
    seq: 11,
    original: '11. Type of Loans.png',
    kebab: '11-type-of-loans.png',
    title: 'लोन (ऋण) के विभिन्न प्रकार (Personal, Home, Car, Education, Gold, Pension, LAP)',
    category: '2. Banking, Savings & Schemes',
    role: 'Core Lesson',
    componentId: 'lesson-05'
  },
  {
    seq: 12,
    original: '12. Bank Draft.png',
    kebab: '12-bank-draft.png',
    title: 'पुराने समय का भरोसेमंद तरीका — बैंक ड्राफ्ट (DD)',
    category: '2. Banking, Savings & Schemes',
    role: 'Supporting Infographic',
    componentId: 'lesson-06'
  },
  {
    seq: 13,
    original: '13.Gift Voucher.png',
    kebab: '13-gift-voucher.png',
    title: 'गिफ्ट वाउचर क्या है और कैसे उपयोग करें?',
    category: '3. Digital Payments & UPI',
    role: 'Supporting Infographic',
    componentId: 'lesson-07'
  },
  {
    seq: 14,
    original: '14. Governemnt Challan.png',
    kebab: '14-government-challan.png',
    title: 'सरकारी चालान (Challan) क्या है? ऑनलाइन भुगतान प्रक्रिया',
    category: '2. Banking, Savings & Schemes',
    role: 'Core Lesson',
    componentId: 'lesson-06'
  },
  {
    seq: 15,
    original: '15.Difference Between Digital Wallet and Pockey Money.png',
    kebab: '15-difference-between-digital-wallet-and-pocket-money.png',
    title: 'डिजिटल वॉलेट और पॉकेट मनी में क्या अंतर है?',
    category: '3. Digital Payments & UPI',
    role: 'Supporting Infographic',
    componentId: 'lesson-07'
  },
  {
    seq: 16,
    original: '16. Net Banking.png',
    kebab: '16-net-banking.png',
    title: 'नेट बैंकिंग (Net Banking) क्या है? घर बैठे सुरक्षित बैंकिंग',
    category: '3. Digital Payments & UPI',
    role: 'Core Lesson',
    componentId: 'lesson-08'
  },
  {
    seq: 17,
    original: '17.DigitalWallets.png',
    kebab: '17-digital-wallets.png',
    title: 'डिजिटल वॉलेट्स (Paytm, Mobikwik, Amazon Pay) कैसे काम करते हैं?',
    category: '3. Digital Payments & UPI',
    role: 'Core Lesson',
    componentId: 'lesson-07'
  },
  {
    seq: 18,
    original: '18. UPI.png',
    kebab: '18-upi.png',
    title: 'UPI क्या है? (Unified Payments Interface Master Guide)',
    category: '3. Digital Payments & UPI',
    role: 'Core Lesson',
    componentId: 'lesson-09'
  },
  {
    seq: 19,
    original: '19. NEFT.png',
    kebab: '19-neft.png',
    title: 'NEFT (National Electronic Funds Transfer) कैसे काम करता है?',
    category: '3. Digital Payments & UPI',
    role: 'Supporting Infographic',
    componentId: 'poster-03'
  },
  {
    seq: 20,
    original: '20.Z-Types of Cheques.png',
    kebab: '20-types-of-cheques.png',
    title: 'चेक (Cheque) के प्रकार — Bearer, Order, Crossed, Account Payee',
    category: '2. Banking, Savings & Schemes',
    role: 'Reference Poster',
    componentId: 'poster-02'
  },
  {
    seq: 21,
    original: '21.Credit card.png',
    kebab: '21-credit-card.png',
    title: 'क्रेडिट कार्ड क्या है? समझें और समझदारी से उपयोग करें',
    category: '3. Digital Payments & UPI',
    role: 'Core Lesson',
    componentId: 'lesson-11'
  },
  {
    seq: 22,
    original: '22.Difference between RTGS, NEFT , IMPS.png',
    kebab: '22-difference-between-rtgs-neft-imps.png',
    title: 'RTGS, NEFT और IMPS — क्या अंतर है? कब कौन सा उपयोग करें?',
    category: '3. Digital Payments & UPI',
    role: 'Reference Poster',
    componentId: 'poster-03'
  },
  {
    seq: 23,
    original: '23. 16 Lessons.png',
    kebab: '23-16-lessons.png',
    title: 'डिजिटल पेमेंट में पूरी समझ - पूरी सुरक्षा (16 जरूरी पाठ)',
    category: '1. Banking का डर दूर करें',
    role: 'Reference Poster',
    componentId: 'poster-04'
  },
  {
    seq: 24,
    original: '24.Banking System.png',
    kebab: '24-banking-system.png',
    title: 'भारतीय बैंकिंग प्रणाली और नियामक व्यवस्था (RBI & Banking Hierarchy)',
    category: '2. Banking, Savings & Schemes',
    role: 'Supporting Infographic',
    componentId: 'lesson-02'
  },
  {
    seq: 25,
    original: '25.Z_Common Usefull Infographics.png',
    kebab: '25-common-useful-infographics.png',
    title: 'डिजिटल दुनिया के सामान्य उपयोगी संकेत और सिंबल',
    category: '3. Digital Payments & UPI',
    role: 'Reference Poster',
    componentId: 'poster-05'
  },
  {
    seq: 26,
    original: '26.Regular Bills Payments.png',
    kebab: '26-regular-bills-payments.png',
    title: 'नियमित बिल भुगतान (बिजली, पानी, गैस, मोबाइल रिचार्ज)',
    category: '3. Digital Payments & UPI',
    role: 'Core Lesson',
    componentId: 'lesson-10'
  },
  {
    seq: 27,
    original: '27. Paytm Pocket Money.png',
    kebab: '27-paytm-pocket-money.png',
    title: 'बच्चों को पॉकेट मनी डिजिटल देने का सुरक्षित तरीका',
    category: '3. Digital Payments & UPI',
    role: 'Supporting Infographic',
    componentId: 'lesson-07'
  },
  {
    seq: 28,
    original: '28. Fix Amount QRCode.png',
    kebab: '28-fix-amount-qr-code.png',
    title: 'Google Pay में Fixed Amount का QR Code कैसे बनाएं?',
    category: '3. Digital Payments & UPI',
    role: 'Core Lesson',
    componentId: 'lesson-09'
  },
  {
    seq: 29,
    original: '29. PaytmWallet.png',
    kebab: '29-paytm-wallet.png',
    title: 'Paytm वॉलेट का सही और सुरक्षित उपयोग',
    category: '3. Digital Payments & UPI',
    role: 'Supporting Infographic',
    componentId: 'lesson-07'
  },
  {
    seq: 30,
    original: '30.ATM Money Not Received.png',
    kebab: '30-atm-money-not-received.png',
    title: 'ATM से पैसे न निकलें लेकिन खाते से कट जाएं तो क्या करें?',
    category: '7. Emergency Help — अब क्या करें?',
    role: 'Emergency Guide',
    componentId: 'emergency-06'
  },
  {
    seq: 31,
    original: '31.Purchasing from Foreign Websites.png',
    kebab: '31-purchasing-from-foreign-websites.png',
    title: 'विदेशी वेबसाइटों से ऑनलाइन खरीदारी करते समय सावधानियां',
    category: '3. Digital Payments & UPI',
    role: 'Core Lesson',
    componentId: 'lesson-12'
  },
  {
    seq: 32,
    original: '32.Receipt of Payment or Payment to Foreigner.png',
    kebab: '32-receipt-of-payment-or-payment-to-foreigner.png',
    title: 'विदेश से पैसा आने या भेजने के सुरक्षित नियम',
    category: '3. Digital Payments & UPI',
    role: 'Core Lesson',
    componentId: 'lesson-12'
  },
  {
    seq: 33,
    original: '33.Habit 1 Observe before Click.png',
    kebab: '33-habit-01-observe-before-click.png',
    title: 'पहली आदत — Observe Before Click (देखें, समझें, फिर क्लिक करें)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 01',
    componentId: 'habit-01'
  },
  {
    seq: 34,
    original: '34. Habit 2 Never Hurry Always Verify.png',
    kebab: '34-habit-02-never-hurry-always-verify.png',
    title: 'दूसरी आदत — Never Hurry Always Verify (जल्दबाज़ी न करें, जांचें)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 02',
    componentId: 'habit-02'
  },
  {
    seq: 35,
    original: '35. Habit 3 Never Share OTP.png',
    kebab: '35-habit-03-never-share-otp.png',
    title: 'तीसरी आदत — Never Share OTP (OTP आपका है — किसी से शेयर न करें)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 03',
    componentId: 'habit-03'
  },
  {
    seq: 36,
    original: '36.Habit 4 Call Back and Verify.png',
    kebab: '36-habit-04-call-back-and-verify.png',
    title: 'चौथी आदत — Call Back and Verify (खुद नंबर मिलाकर पुष्टि करें)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 04',
    componentId: 'habit-04'
  },
  {
    seq: 37,
    original: '37.Habit 5 Use Official Apps Only.png',
    kebab: '37-habit-05-use-official-apps-only.png',
    title: 'पांचवीं आदत — Use Official Apps Only (केवल असली ऐप का उपयोग करें)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 05',
    componentId: 'habit-05'
  },
  {
    seq: 38,
    original: '38.Habit 6 Verify Before You Trust.png',
    kebab: '38-habit-06-verify-before-you-trust.png',
    title: 'छठी आदत — Verify Before You Trust (जांचे बिना भरोसा न करें)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 06',
    componentId: 'habit-06'
  },
  {
    seq: 39,
    original: '39.Habit 7 Keep Your Phone Locked.png',
    kebab: '39-habit-07-keep-your-phone-locked.png',
    title: 'सातवीं आदत — Keep Your Phone Locked (फोन हमेशा लॉक रखें)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 07',
    componentId: 'habit-07'
  },
  {
    seq: 40,
    original: '40.Habit 8 Keep Low Balance Seperate Account.png',
    kebab: '40-habit-08-keep-low-balance-separate-account.png',
    title: 'आठवीं आदत — Keep Low Balance Separate Account',
    category: '4. Good Digital Habits',
    role: 'Habit Card 08',
    componentId: 'habit-08'
  },
  {
    seq: 41,
    original: '41.Habit 9 Keep App Permission Limited.png',
    kebab: '41-habit-09-keep-app-permission-limited.png',
    title: 'नौवीं आदत — Keep App Permission Limited (ऐप परमिशन सीमित रखें)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 09',
    componentId: 'habit-09'
  },
  {
    seq: 42,
    original: '42.Habit 10 Keep Software App Updated.png',
    kebab: '42-habit-10-keep-software-app-updated.png',
    title: 'दसवीं आदत — Keep Software/App Updated (सिस्टम व ऐप अपडेट रखें)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 10',
    componentId: 'habit-10'
  },
  {
    seq: 43,
    original: '43.Use of WIFI with Care.png',
    kebab: '43-habit-11-use-of-wifi-with-care.png',
    title: 'सार्वजनिक Wi-Fi का सुरक्षित उपयोग (Use of Wi-Fi with Care)',
    category: '4. Good Digital Habits',
    role: 'Habit Card 11',
    componentId: 'habit-11'
  },
  {
    seq: 44,
    original: '44.Scam Case 01 Online Loan.png',
    kebab: '44-scam-01-online-loan.png',
    title: 'Scam 01: ऑनलाइन लोन के बहाने ब्लैकमेल स्कैम',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 01',
    componentId: 'scam-01'
  },
  {
    seq: 45,
    original: '45.Scam Case 02 Bank Verification KYC etc.png',
    kebab: '45-scam-02-bank-verification-kyc.png',
    title: 'Scam 02: KYC अपडेट / बैंक वेरिफिकेशन के नाम पर धोखाधड़ी',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 02',
    componentId: 'scam-02'
  },
  {
    seq: 46,
    original: '46.Scam Case 03 Digital Arrest.png',
    kebab: '46-scam-03-digital-arrest.png',
    title: 'Scam 03: डिजिटल अरेस्ट स्कैम — डराकर ठगी',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 03',
    componentId: 'scam-03'
  },
  {
    seq: 47,
    original: '47.Scam Case 04 Wrong QR Code.png',
    kebab: '47-scam-04-wrong-qr-code.png',
    title: 'Scam 04: UPI QR कोड स्कैम — गलत QR, खाली अकाउंट!',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 04',
    componentId: 'scam-04'
  },
  {
    seq: 48,
    original: '48.Scam Case 05 Online Shopping.png',
    kebab: '48-scam-05-online-shopping.png',
    title: 'Scam 05: ऑनलाइन शॉपिंग स्कैम — सस्ता ऑफर, बड़ा धोखा!',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 05',
    componentId: 'scam-05'
  },
  {
    seq: 49,
    original: '49.Scam Case 06 Screen Sharing.png',
    kebab: '49-scam-06-screen-sharing.png',
    title: 'Scam 06: स्क्रीन शेयरिंग ऐप स्कैम — "मैं मदद करता हूँ"',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 06',
    componentId: 'scam-06'
  },
  {
    seq: 50,
    original: '50.Scam Case 07 Work From Home.png',
    kebab: '50-scam-07-work-from-home.png',
    title: 'Scam 07: वर्क फ्रॉम होम स्कैम — आसान कमाई का लालच',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 07',
    componentId: 'scam-07'
  },
  {
    seq: 51,
    original: '51.Scam Case 08 Romance Love.png',
    kebab: '51-scam-08-romance-love.png',
    title: 'Scam 08: रोमांस / लव स्कैम — भावनाओं से खेलकर ठगी',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 08',
    componentId: 'scam-08'
  },
  {
    seq: 52,
    original: '52.Scam Case 09 Investment Funding.png',
    kebab: '52-scam-09-investment-funding.png',
    title: 'Scam 09: इन्वेस्टमेंट स्कैम — 21 दिन में पैसा डबल का झांसा',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 09',
    componentId: 'scam-09'
  },
  {
    seq: 53,
    original: '53.Scam Case 10 Wrong Website address.png',
    kebab: '53-scam-10-wrong-website-address.png',
    title: 'Scam 10: गलत वेबसाइट एड्रेस (Typosquatting / Fake Domain)',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 10',
    componentId: 'scam-10'
  },
  {
    seq: 54,
    original: '54.Scam case 11 Whatsapp Hack Sending Number.png',
    kebab: '54-scam-11a-whatsapp-hack-sending-number.png',
    title: 'Scam 11A: WhatsApp हैकिंग — "मेरा PIN ब्लॉक हो गया है, पैसे लौटा दूंगा"',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 11A',
    componentId: 'scam-11a'
  },
  {
    seq: 55,
    original: '55.Scam Case 11 Whatsapp Hack Sending Scanner.png',
    kebab: '55-scam-11b-whatsapp-hack-sending-scanner.png',
    title: 'Scam 11B: WhatsApp हैकिंग — "WhatsApp ने स्कैनर भेजा है, स्कैन कर दो"',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 11B',
    componentId: 'scam-11b'
  },
  {
    seq: 56,
    original: '56.Scam Case 12 IPhoneLost SIM Transfered into another.png',
    kebab: '56-scam-12a-lost-phone-sim-transferred.png',
    title: 'Scam 12A: फोन गुम हुआ? SIM निकालकर *99# डायल कर नंबर हैक',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 12A',
    componentId: 'scam-12a'
  },
  {
    seq: 57,
    original: '57. Scam Case 12 Phone Lost SIM Clone.png',
    kebab: '57-scam-12b-phone-lost-sim-clone.png',
    title: 'Scam 12B: SIM क्लोनिंग और eSIM सुरक्षा कवच',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 12B',
    componentId: 'scam-12b'
  },
  {
    seq: 58,
    original: '58. Scam Case 13 Help at ATM.png',
    kebab: '58-scam-13-help-at-atm.png',
    title: 'Scam 13: ATM पर मदद के बहाने कार्ड बदलना और PIN देखना',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 13',
    componentId: 'scam-13'
  },
  {
    seq: 59,
    original: '59. Scam Case 14.png',
    kebab: '59-scam-14-untrusted-website-malware.png',
    title: 'Scam 14: Untrusted या अश्लील वेबसाइट पर जाने से मालवेयर हमला',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 14',
    componentId: 'scam-14'
  },
  {
    seq: 60,
    original: '60. Scam Case 15.png',
    kebab: '60-scam-15-identity-theft-aadhaar-pan.png',
    title: 'Scam 15: पहचान चोरी (Identity Theft) — आधार, पैन व डेटा का दुरुपयोग',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 15',
    componentId: 'scam-15'
  },
  {
    seq: 61,
    original: '61. Scam Case 16 Phone Misplace.png',
    kebab: '61-scam-16-phone-misplace.png',
    title: 'Scam 16: फोन कहीं रखकर भूल गए? अनलॉक फोन से 2 मिनट में डेटा चोरी',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 16',
    componentId: 'scam-16'
  },
  {
    seq: 62,
    original: '62. Scam Case 17 Change in setting of Phone.png',
    kebab: '62-scam-17-call-forwarding-trap.png',
    title: 'Scam 17: "मेरा फोन चोरी हो गया, कृपया एक कॉल करने दीजिए..."',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 17',
    componentId: 'scam-17'
  },
  {
    seq: 63,
    original: '63. Scam Case 18 Bus Stand.png',
    kebab: '63-scam-18-bus-stand-otp.png',
    title: 'Scam 18: बस स्टैंड पर मदद के बहाने आपका OTP बोलकर ठगी',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 18',
    componentId: 'scam-18'
  },
  {
    seq: 64,
    original: '64.Verify Source Where Get Payment.png',
    kebab: '64-scam-19-verify-source-mule-account.png',
    title: 'Scam 19: पैसा आते ही सावधान रहें — खाता फ्रीज होने का खतरा (Mule Accounts)',
    category: '5. Cyber Frauds — Scam Cases',
    role: 'Scam Case 19',
    componentId: 'scam-19'
  },
  {
    seq: 65,
    original: '65.Z-eSIM.png',
    kebab: '65-esim.png',
    title: 'eSIM क्या होता है? (फायदे, जांचने का तरीका और एक्टिवेशन प्रोसेस)',
    category: '6. Phone & Identity Security',
    role: 'Core Lesson',
    componentId: 'lesson-14'
  },
  {
    seq: 66,
    original: '66.Z-Aadharcard, Google Gmail, Whatsapp.png',
    kebab: '66-four-in-one-security-audit.png',
    title: '4-इन-1 सुरक्षा ऑडिट: आधार, गूगल अकाउंट, वॉट्सऐप, और पासवर्ड चेक',
    category: '6. Phone & Identity Security',
    role: 'Core Lesson',
    componentId: 'lesson-15'
  },
  {
    seq: 67,
    original: '67.Z-2FA, Passkey, Password Manager.png',
    kebab: '67-two-factor-passkey-password-manager.png',
    title: 'मजबूत सुरक्षा की 3 कुंजियां — 2FA, Passkeys, और Password Manager',
    category: '6. Phone & Identity Security',
    role: 'Core Lesson',
    componentId: 'lesson-16'
  },
  {
    seq: 68,
    original: '68.Old Phone Sale.png',
    kebab: '68-old-phone-sale-checklist.png',
    title: 'पुराना फोन बेचें या किसी को दें? 12-स्टेप सुरक्षा चेकलिस्ट',
    category: '6. Phone & Identity Security',
    role: 'Core Lesson',
    componentId: 'lesson-17'
  },
  {
    seq: 69,
    original: '69.Auto Deduct Only Paytm.png',
    kebab: '69-auto-deduct-paytm.png',
    title: 'Paytm में अनजाने ऑटो-पेमेंट को कैसे चेक करें और रोकें',
    category: '3. Digital Payments & UPI',
    role: 'Supporting Infographic',
    componentId: 'lesson-13'
  },
  {
    seq: 70,
    original: '70.Auto Deduct All Apps.png',
    kebab: '70-auto-deduct-all-apps.png',
    title: 'Auto Payment / Auto Deduct मास्टर गाइड (Paytm, GPay, PhonePe, Banks, Cards)',
    category: '3. Digital Payments & UPI',
    role: 'Core Lesson',
    componentId: 'lesson-13'
  },
  {
    seq: 71,
    original: '71.Difference Between Credit Card and Debit Card.png',
    kebab: '71-difference-between-credit-card-and-debit-card.png',
    title: 'डेबिट कार्ड और क्रेडिट कार्ड में क्या अंतर है? (विस्तृत तुलना तालिका)',
    category: '3. Digital Payments & UPI',
    role: 'Reference Poster',
    componentId: 'poster-06'
  },
  {
    seq: 72,
    original: '72. BackPage.png',
    kebab: '72-back-page.png',
    title: 'आभार एवं समर्पित संदेश (Sh. Vinod Singla profile & national helplines)',
    category: '1. Banking का डर दूर करें',
    role: 'Cover / Title',
    componentId: 'bookend-profile'
  }
];

function computeSha256(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function run() {
  console.log('--- Digital Banking Asset Ingestion & Verification ---');
  console.log(`Source Directory: ${SOURCE_DIR}`);
  console.log(`Destination Directory: ${DEST_DIR}`);

  // 1. Check Source Directory
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Source folder not found: ${SOURCE_DIR}`);
  }
  const sourceFiles = fs.readdirSync(SOURCE_DIR).filter(f => f.toLowerCase().endsWith('.png'));
  console.log(`Found ${sourceFiles.length} PNG files in source directory.`);
  if (sourceFiles.length !== 72) {
    throw new Error(`Expected exactly 72 source PNG files, found ${sourceFiles.length}`);
  }

  // 2. Prepare Destination
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
    console.log(`Created destination directory: ${DEST_DIR}`);
  }

  // 3. Verify mappings count
  if (ASSETS.length !== 72) {
    throw new Error(`Expected exactly 72 mapping entries, got ${ASSETS.length}`);
  }

  // Check unique sequence numbers
  const seqSet = new Set(ASSETS.map(a => a.seq));
  if (seqSet.size !== 72) {
    throw new Error(`Duplicate sequence numbers detected! Distinct count: ${seqSet.size}`);
  }

  // Check unique kebab filenames
  const kebabSet = new Set(ASSETS.map(a => a.kebab));
  if (kebabSet.size !== 72) {
    throw new Error(`Duplicate destination filenames detected! Distinct count: ${kebabSet.size}`);
  }

  // 4. Ingest and Hash
  const manifestEntries = [];
  let copiedCount = 0;
  let verifiedCount = 0;

  for (const item of ASSETS) {
    const srcPath = path.join(SOURCE_DIR, item.original);
    const destPath = path.join(DEST_DIR, item.kebab);

    if (!fs.existsSync(srcPath)) {
      throw new Error(`Source file missing: "${item.original}" at ${srcPath}`);
    }

    // Copy without altering bytes
    fs.copyFileSync(srcPath, destPath);
    copiedCount++;

    // Calculate hashes
    const srcHash = computeSha256(srcPath);
    const destHash = computeSha256(destPath);
    const srcStat = fs.statSync(srcPath);
    const destStat = fs.statSync(destPath);

    if (srcHash !== destHash) {
      throw new Error(`Checksum mismatch on ${item.kebab}! Source: ${srcHash}, Dest: ${destHash}`);
    }
    if (srcStat.size !== destStat.size) {
      throw new Error(`Size mismatch on ${item.kebab}! Source: ${srcStat.size}, Dest: ${destStat.size}`);
    }
    verifiedCount++;

    manifestEntries.push({
      sequenceNumber: item.seq,
      originalFilename: item.original,
      newFilename: item.kebab,
      relativeAssetPath: `/tutorials/digital-banking/assets/${item.kebab}`,
      title: item.title,
      primaryCategory: item.category,
      resourceRole: item.role,
      relatedComponentId: item.componentId,
      sha256: destHash,
      fileSizeBytes: destStat.size
    });
  }

  console.log(`Successfully copied: ${copiedCount} files.`);
  console.log(`Successfully verified (SHA-256): ${verifiedCount} files.`);

  // 5. Write Manifest Files
  const manifestData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      author: 'Sh. Vinod Singla (Former Sr. Director cum DIO, NIC, Kurukshetra, Govt. of India)',
      totalAssets: manifestEntries.length,
      allVerifiedSha256: verifiedCount === 72,
      sourceDirectory: SOURCE_DIR,
      relativeBaseDirectory: '/tutorials/digital-banking/assets/'
    },
    assets: manifestEntries
  };

  fs.writeFileSync(MANIFEST_PUBLIC_PATH, JSON.stringify(manifestData, null, 2), 'utf-8');
  console.log(`Wrote public manifest to: ${MANIFEST_PUBLIC_PATH}`);

  // Ensure src/data exists
  const srcDataDir = path.dirname(MANIFEST_SRC_PATH);
  if (!fs.existsSync(srcDataDir)) {
    fs.mkdirSync(srcDataDir, { recursive: true });
  }
  fs.writeFileSync(MANIFEST_SRC_PATH, JSON.stringify(manifestData, null, 2), 'utf-8');
  console.log(`Wrote source data manifest to: ${MANIFEST_SRC_PATH}`);

  // 6. Final Destination Verification
  const destFiles = fs.readdirSync(DEST_DIR).filter(f => f.toLowerCase().endsWith('.png'));
  console.log(`Total destination PNGs: ${destFiles.length}`);
  if (destFiles.length !== 72) {
    throw new Error(`Destination PNG count mismatch! Expected 72, found ${destFiles.length}`);
  }

  console.log('--- ALL 72 ASSETS INGESTED & VERIFIED 100% BYTE-FOR-BYTE ---');
}

run().catch(err => {
  console.error('FATAL ERROR during asset ingestion:', err);
  process.exit(1);
});
