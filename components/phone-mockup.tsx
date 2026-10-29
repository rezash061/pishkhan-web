import { Icon } from "./icons";

// Static DM mockup (HTML, no image or video): a Finglish question, a receipt check and a tracking code.
export function PhoneMockup({ label }: { label: string }) {
  const bubbleIn = "self-start max-w-[80%] rounded-2xl rounded-ss-md bg-surface-2 px-3.5 py-2 text-[0.8rem] leading-6";
  const bubbleOut = "self-end max-w-[82%] rounded-2xl rounded-se-md bg-gradient-to-br from-brand-500 to-brand-700 px-3.5 py-2 text-[0.8rem] leading-6 text-white";
  return (
    <figure aria-label={label} className="relative mx-auto w-full max-w-[19rem]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-400/30 via-accent-400/20 to-sun-400/20 blur-2xl" aria-hidden="true" />
      <div className="rounded-[2.6rem] border border-border bg-fg/90 p-2.5 shadow-[var(--shadow-float)] dark:bg-black">
        <div className="overflow-hidden rounded-[2.1rem] bg-surface">
          <div className="flex items-center gap-2.5 border-b border-border px-4 pb-3 pt-5">
            <span className="size-8 rounded-full bg-gradient-to-br from-accent-500 to-sun-400" aria-hidden="true" />
            <div className="leading-5">
              <p className="text-sm font-bold" dir="ltr">
                mahsa.shop
              </p>
              <p className="text-[0.7rem] text-success">پاسخ‌گوی هوشمند فعال</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 px-3 py-4" aria-hidden="true">
            <p className={bubbleIn} dir="ltr">
              salam, in manto meshki size L dare? ersal be shiraz chand rooze?
            </p>
            <p className={bubbleOut}>سلام! بله، مانتو کتان مشکی سایز L موجوده 🌸 قیمت ۱٬۲۸۰٬۰۰۰ تومان. ارسال به شیراز ۲ تا ۳ روز کاری با پست پیشتاز.</p>
            <div className="self-start w-[62%] rounded-2xl rounded-ss-md bg-surface-2 p-2">
              <div className="rounded-xl bg-gradient-to-b from-emerald-100 to-emerald-50 p-2 text-[0.65rem] leading-5 text-emerald-950 dark:from-emerald-950 dark:to-emerald-900 dark:text-emerald-100">
                <p className="font-bold">رسید انتقال وجه</p>
                <p>مبلغ: ۱٬۲۸۰٬۰۰۰ تومان</p>
                <p>کارت مقصد: ••••۴۲۱۷</p>
              </div>
            </div>
            <div className="self-end flex max-w-[82%] items-start gap-1.5 rounded-2xl rounded-se-md bg-gradient-to-br from-brand-500 to-brand-700 px-3.5 py-2 text-[0.8rem] leading-6 text-white">
              <Icon name="check" className="mt-1 size-4 shrink-0" />
              <span>رسید تأیید شد. سفارش شما ثبت شد و فردا ارسال می‌شود.</span>
            </div>
            <p className={bubbleOut}>
              کد رهگیری مرسوله: <span dir="ltr">۲۴۰۸۱۳۵۷۹۰</span> 📦
            </p>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
