import { useEffect, useMemo, useState } from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useSession,
} from "@clerk/react";

import { createClerkSupabaseClient } from "./SupabaseClient";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import LostFound from "./pages/LostFound";
import UserForm from "./pages/UserForm";
import "./App.css";

function App() {
const { isLoaded, isSignedIn, user } = useUser();
const { session } = useSession();

const supabase = useMemo(
  () => createClerkSupabaseClient(session),
  [session]
);

const isAdmin =
  user?.publicMetadata?.role === "admin";

  const [items, setItems] = useState([]);
  const [page, setPage] = useState("home");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LOAD ITEMS ERROR:", error);
      return;
    }

    setItems(data || []);
  }

 async function deleteItem(id) {
  if (!isAdmin) {
    alert("Only the admin can delete items.");
    return false;
  }

  const confirmed = window.confirm(
    "Are you sure you want to permanently delete this item?"
  );

  if (!confirmed) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from("items")
      .delete()
      .eq("id", id)
      .select("id");

    console.log("DELETE RESULT:", data);
    console.log("DELETE ERROR:", error);

    if (error) {
      console.error("Delete error:", error);

      alert(
        "Could not delete the item.\n\n" +
        error.message
      );

      return false;
    }

    /*
      If RLS blocks the DELETE, Supabase can return
      no error but also delete 0 rows.
    */
    if (!data || data.length === 0) {
      console.error(
        "DELETE FAILED: No rows were deleted."
      );

      alert(
        "The item was NOT deleted from the database.\n\n" +
        "Please check the Supabase DELETE policy."
      );

      return false;
    }

    // Only update React state after REAL database deletion
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );

    alert("Item permanently deleted.");

    return true;

  } catch (error) {
    console.error("DELETE EXCEPTION:", error);

    alert(
      "Something went wrong while deleting the item."
    );

    return false;
  }
}
   

  async function addItem(newItem) {
    if (!isSignedIn) {
      alert("Please sign in before reporting an item.");
      return false;
    }

    const itemToAdd = {
      title: newItem.title,
      type: newItem.type || "Lost",
      category: newItem.category || "",
      location: newItem.location || "",
      date: newItem.date || "",
      status: newItem.status || newItem.type || "Lost",
      image: newItem.image || "",
      details: newItem.details || "",
    };

    const { data, error } = await supabase
      .from("items")
      .insert([itemToAdd])
      .select()
      .single();

    if (error) {
      console.error("ADD ITEM ERROR:", error);
      alert("Could not save the item.");
      return false;
    }

    setItems((current) => [data, ...current]);
    setPage("home");

    return true;
  }

  async function markAsFound(id) {
    const { data, error } = await supabase
      .from("items")
      .update({
        type: "Found",
        status: "Found",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("UPDATE ERROR:", error);
      alert("Could not update the item.");
      return false;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id ? data : item
      )
    );

    return true;
  }

  if (!isLoaded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading Campus Find...
      </div>
    );
  }

  return (
    <div className="app-shell">

      <Navbar
        page={page}
        setPage={setPage}
      />

      <div
        style={{
          position: "absolute",
          top: "18px",
          right: "24px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >

        <Show when="signed-out">

          <SignInButton mode="modal">
            <button
              className="ghost-btn"
              type="button"
            >
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button
              className="primary-btn"
              type="button"
            >
              Sign Up
            </button>
          </SignUpButton>

        </Show>

        <Show when="signed-in">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#ffffff",
              padding: "6px 10px",
              borderRadius: "30px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
            }}
          >

            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {user?.firstName
                ? `Hi, ${user.firstName}`
                : "Welcome"}
            </span>

            <UserButton />

          </div>

        </Show>

      </div>

      {page === "home" && (
        <Home
          items={items}
          setPage={setPage}
        />
      )}

      {page === "lostfound" && (
        <LostFound
          items={items}
          setPage={setPage}
          user={user}
          markAsFound={markAsFound}
          deleteItem={deleteItem}
          isAdmin={isAdmin}
          supabase={supabase}
        />
      )}

      {page === "report" && (
        <>
          {isSignedIn ? (
            <UserForm
              setPage={setPage}
              addItem={addItem}
            />
          ) : (
            <main className="simple-page">
              <section className="simple-panel">

                <span className="section-kicker">
                  SIGN IN REQUIRED
                </span>

                <h1>
                  Sign in to report an item.
                </h1>

                <p>
                  You need to sign in before reporting
                  a lost or found item.
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "25px",
                  }}
                >

                  <SignInButton mode="modal">
                    <button
                      className="primary-btn"
                      type="button"
                    >
                      Sign In
                      <span>→</span>
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button
                      className="ghost-btn"
                      type="button"
                    >
                      Create Account
                    </button>
                  </SignUpButton>

                </div>

              </section>
            </main>
          )}
        </>
      )}

      {page === "about" && (
        <About setPage={setPage} />
      )}

    </div>
  );
}

function About({ setPage }) {
  return (
    <main className="simple-page">

      <section className="simple-panel">

        <span className="section-kicker">
          ABOUT CAMPUS FIND
        </span>

        <h1>
          Lost something?
          <br />
          We help you find it.
        </h1>

        <p>
          Campus Find is a simple lost and found
          platform for students.
        </p>

        <button
          className="primary-btn"
          onClick={() => setPage("lostfound")}
        >
          Browse items
          <span>→</span>
        </button>

      </section>

    </main>
  );
}

export default App;