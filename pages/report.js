import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Report.module.css";
import home from "@/styles/Home.module.css"; // ← reuse the real header styles

// Firebase (client-only)
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJhxil7RsyubTwCBIctYsoLDgpMXikTM8",
  authDomain: "quickshaw-e3d95.firebaseapp.com",
  databaseURL: "https://quickshaw-e3d95-default-rtdb.firebaseio.com",
  projectId: "quickshaw-e3d95",
  storageBucket: "quickshaw-e3d95.firebasestorage.app",
  messagingSenderId: "1042700258885",
  appId: "1:1042700258885:web:6b88a78aead1a567039d2c",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ReportPage() {
  // form state
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [rideId, setRideId] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ui state
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const phoneOk = !phone || /^\+?[0-9]{7,15}$/.test(phone);
  const emailOk = !email || /.+@.+\..+/.test(email);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!category || !description) {
      setToast({
        type: "error",
        msg: "Category and description are required.",
      });
      return;
    }
    if (!phoneOk || !emailOk) {
      setToast({ type: "error", msg: "Please check phone/email format." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category,
        description,
        rideId: rideId || null,
        pickup: pickup || null,
        drop: drop || null,
        reporter: {
          name: name || null,
          phone: phone || null,
          email: email || null,
        },
        imageUrl: imageUrl || null,
        status: "open",
        createdAt: serverTimestamp(),
        client: {
          ua: typeof navigator !== "undefined" ? navigator.userAgent : null,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };
      await addDoc(collection(db, "problem_reports"), payload);
      setToast({
        type: "success",
        msg: "Report submitted. We’ll get back soon.",
      });
      setDescription("");
      setRideId("");
      setPickup("");
      setDrop("");
      setImageUrl("");
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        msg: "Couldn’t submit. Try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleRaise() {
    setShowIntro(false);
    const el = document.getElementById("reportForm");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Head>
        <title>Report a Problem • QuickShaw</title>
        <meta
          name="description"
          content="Tell us what went wrong so we can fix it fast."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>

      {/* Topbar — use Home styles to keep it identical */}
      <div className={home.topbar}>
        <div className={home.topbarInner}>
          <Link href="/" className={home.brand}>
            <Image
              src="/quickshaw-logo.png"
              alt="QuickShaw"
              height={36}
              width={160}
              priority
            />
          </Link>

          <nav className={home.menu}>
            <Link href="/" className={home.link}>
              Home
            </Link>
            <Link href="/offerings" className={home.link}>
              Offerings
            </Link>
            <Link href="/#social" className={home.link}>
              Social
            </Link>
            <Link href="/report" className={home.link}>
              Report a problem
            </Link>
          </nav>
          <div aria-hidden />
        </div>
      </div>

      {/* Intro Hero Block */}
      {showIntro && (
        <section className={styles.introWrap}>
          <div className={styles.introInner}>
            <h1 className={styles.introH1}>A safe mobility platform is here</h1>
            <button className={styles.introBtn} onClick={handleRaise}>
              Raise a complaint
            </button>
          </div>
          <div className={styles.pitchInner}>
            <h2 className={styles.pitchH1}>YOUR SAFETY IS OUR PRIORITY</h2>
            <p className={styles.pitchSub}>
              One-tap alert to trusted contacts & QuickShaw team. verified
              drivers for every ride. live trip tracking from start to finish.
              instant support, always on standby.
            </p>
            <div className={styles.pitchRow}>
              <span className={styles.pitchLead}>Ensuring Safety,</span>
              <span className={styles.pitchHow}> HOW IT WORKS</span>
            </div>
            <svg
              className={styles.pitchChevron}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </section>
      )}

      {toast && (
        <div
          className={`${styles.toast} ${
            toast.type === "error" ? styles.toastErr : styles.toastOk
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Safety Section */}
      <section className={styles.safetySection}>
        <div className={styles.safetyContent}>
          <h2 className={styles.safetyTitle}>Tap safe now</h2>
          <p className={styles.safetyText}>
            Your ride comes with more than just wheels, it comes with trust in
            verified drivers, care built into every detail, & a constant watch
            over your journey to ensure your safety.
          </p>
        </div>
        <div className={styles.safetyImage}>
          <Image
            src="/tap-safe.png" // put the screenshot file in /public as tap-safe.png
            alt="Tap Safe feature"
            width={350}
            height={500}
            priority
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.brandFoot}>
            © {new Date().getFullYear()} QuickShaw
          </div>
          <nav className={styles.footLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/customer_terms">Customer Terms</Link>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
