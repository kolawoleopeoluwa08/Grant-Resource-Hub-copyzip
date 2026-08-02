import { db } from "./lib/db/src/index.js";
import { testimonialsTable } from "./lib/db/src/schema/index.js";

async function main() {
  console.log("Seeding testimonials...");

  await db
    .insert(testimonialsTable)
    .values([
      {
        name: "Tyler Johnson",
        location: "Junior at University of Michigan",
        aidType: "tuition_fees",
        message:
          "I was one semester away from having to drop out because I could no longer afford tuition. The HopeGrant Foundation stepped in with a full tuition grant that kept me on track to graduate.",
        rating: 5,
        avatarInitials: "TJ",
      },
      {
        name: "Aisha Williams",
        location: "Senior at Howard University",
        aidType: "general_education",
        message:
          "As a first-generation college student from a single-parent household, the financial burden was enormous. Hope's education grant covered my final year tuition.",
        rating: 5,
        avatarInitials: "AW",
      },
      {
        name: "Marcus Chen",
        location: "Graduate Student at UCLA",
        aidType: "research_fees",
        message:
          "My research fellowship funding fell through at the last minute and I nearly had to abandon my PhD program. HopeGrant covered my research fees and living expenses.",
        rating: 5,
        avatarInitials: "MC",
      },
      {
        name: "Priya Patel",
        location: "Sophomore at Ohio State University",
        aidType: "housing_meals",
        message:
          "I was choosing between paying rent and buying groceries most weeks. This grant covered my campus housing for the semester and let me actually focus on my classes instead of survival.",
        rating: 5,
        avatarInitials: "PP",
      },
      {
        name: "Jordan Reyes",
        location: "Freshman at Arizona State University",
        aidType: "technology_equipment",
        message:
          "I started my first semester without a laptop, borrowing one from the library between classes. The technology grant let me buy a laptop of my own within two weeks.",
        rating: 5,
        avatarInitials: "JR",
      },
      {
        name: "Emily Carter",
        location: "Junior at University of Texas at Austin",
        aidType: "books_supplies",
        message:
          "Textbook costs alone were eating my entire work-study paycheck every semester. This grant covered my books for the year so I could actually save something.",
        rating: 5,
        avatarInitials: "EC",
      },
      {
        name: "Daniel Osei",
        location: "Senior at Penn State University",
        aidType: "study_abroad",
        message:
          "I'd been accepted into a study abroad program in Ghana but couldn't afford the program fees. Hope Foundation made it possible for me to go and reconnect with family history along the way.",
        rating: 5,
        avatarInitials: "DO",
      },
      {
        name: "Grace Kim",
        location: "Graduate Student at University of Washington",
        aidType: "tuition_fees",
        message:
          "Between rent, tuition, and a part-time job, I was barely keeping my head above water. This grant covered my spring tuition and gave me room to breathe and actually study.",
        rating: 5,
        avatarInitials: "GK",
      },
    ])
    .onConflictDoNothing();

  console.log("Testimonials seeded!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
