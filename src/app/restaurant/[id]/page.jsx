import Restaurant from "@/src/components/old_ReviewItems/Restaurant.jsx";
import { Suspense } from "react";
import { getRestaurantById } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import ReviewsList, {
  ReviewsListSkeleton,
} from "@/src/components/old_ReviewItems/Reviews/ReviewsList";
import {
  GeminiSummary,
  GeminiSummarySkeleton,
} from "@/src/components/old_ReviewItems/Reviews/ReviewSummary";
import { getFirestore } from "firebase/firestore";

export default async function RestaurantPage({ params }) {
  const { currentUser, firebaseServerApp } = await getAuthenticatedAppForUser();
  const restaurant = await getRestaurantById(getFirestore(firebaseServerApp), params.id);

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <main className="main__restaurant">
      <Restaurant
        id={params.id}
        initialRestaurant={restaurant}
        initialUserId={currentUser?.uid || ""}
      >
        <Suspense fallback={<GeminiSummarySkeleton />}>
          <GeminiSummary restaurantId={params.id} />
        </Suspense>
      </Restaurant>
      <Suspense
        fallback={<ReviewsListSkeleton numReviews={restaurant.numRatings} />}
      >
        <ReviewsList restaurantId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </main>
  );
}
