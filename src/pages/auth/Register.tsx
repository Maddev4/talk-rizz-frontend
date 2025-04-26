import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonLoading,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import { mailOutline, lockClosedOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Spinner from "../../components/Spinner";
import SocialAuth from "../../components/SocialAuth";
import "./Register.css";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { signUp } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error
    setError(null);

    // Validate form
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation (at least  characters)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);

      // Register user with Supabase
      await signUp(email, password);

      setLoading(false);
      history.push("/auth/login");
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center">Sign Up</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <form onSubmit={handleRegister}>
              <IonList>
                <IonItem>
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value || "")}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value || "")}
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="floating">Confirm Password</IonLabel>
                  <IonInput
                    type="password"
                    value={confirmPassword}
                    onIonChange={(e) => {
                      setConfirmPassword(e.detail.value || "");
                    }}
                    required
                  />
                </IonItem>
              </IonList>

              {error && (
                <IonText color="danger" className="ion-padding">
                  <p>{error}</p>
                </IonText>
              )}

              <div className="ion-padding">
                <IonButton expand="block" type="submit">
                  Register
                </IonButton>
                <IonButton expand="block" fill="clear" routerLink="/auth/login">
                  Already have an account? Login
                </IonButton>
              </div>
            </form>
            <div className="social-auth-divider">
              <span>or</span>
            </div>
            <SocialAuth mode="signup" onError={setError} />
          </IonCardContent>
        </IonCard>

        {loading && <Spinner />}
      </IonContent>
    </IonPage>
  );
};

export default Register;
