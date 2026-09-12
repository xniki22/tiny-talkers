import {
  useEffect,
  useState,
} from "react";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ChildProfilePage } from "./pages/ChildProfilePage";
import { ChildHomePage } from "./pages/ChildHomePage";
import { LessonPage } from "./pages/LessonPage";
import { LevelCompletePage } from "./pages/LevelCompletePage";

import { levels } from "./data/levels";

import { authService } from "./services/authService";
import { childService } from "./services/ChildService";
import { progressService } from "./services/ProgressService";

import type { IUser } from "./interfaces/IUser";
import type { IChildProfile } from "./interfaces/IChildProfile";


  

type AppPage =
  | "login"
  | "register"
  | "profiles"
  | "home"
  | "lesson"
  | "complete";

function App() {
  const [page, setPage] =
    useState<AppPage>("login");


  const [
    currentUser,
    setCurrentUser,
  ] = useState<IUser | null>(null);

  const [
    children,
    setChildren,
  ] = useState<IChildProfile[]>([]);

  const [
    selectedChild,
    setSelectedChild,
  ] = useState<IChildProfile | null>(
    null
  );

  const [
    selectedLevelId,
    setSelectedLevelId,
  ] = useState<string | null>(null);

  const [
    completedLevelIds,
    setCompletedLevelIds,
  ] = useState<string[]>([]);

  const [
    completedItemIds,
    setCompletedItemIds,
  ] = useState<string[]>([]);

  const [
    completedItemCounts,
    setCompletedItemCounts,
  ] = useState<Record<string, number>>(
    {}
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isLessonLoading,
    setIsLessonLoading,
  ] = useState(false);

  const selectedLevel =
    levels.find(
      (level) =>
        level.levelId ===
        selectedLevelId
    ) ?? null;

  const loadChildren = async () => {
    const loadedChildren =
      await childService.getChildren();

    setChildren(loadedChildren);
  };

  const handleLogout = async () => {
  try {
    await authService.logout();
  } finally {
    setCurrentUser(null);
    setSelectedChild(null);
    setSelectedLevelId(null);
    setCompletedLevelIds([]);
    setCompletedItemIds([]);
    setCompletedItemCounts({});
    setChildren([]);
    setPage("login");
  }
};
const handleSwitchProfile = () => {
  setSelectedChild(null);
  setSelectedLevelId(null);
  setCompletedLevelIds([]);
  setCompletedItemIds([]);
  setCompletedItemCounts({});

  setPage("profiles");
};

  useEffect(() => {
    const checkAuthentication =
      async () => {
        try {
          const user =
            await authService
              .getCurrentUser();

          if (!user) {
            setPage("login");
            return;
          }

          setCurrentUser(user);

          await loadChildren();

          setPage("profiles");
        } catch (error) {
          console.error(
            "Could not check authentication:",
            error
          );

          setPage("login");
        } finally {
          setIsLoading(false);
        }
      };

    void checkAuthentication();
  }, []);

  const handleLogin = async (
    email: string,
    password: string
  ) => {
    const user =
      await authService.login(
        email,
        password
      );

    setCurrentUser(user);

    await loadChildren();

    setPage("profiles");
  };

  const handleRegister = async (
    email: string,
    password: string
  ) => {
    const user =
      await authService.register(
        email,
        password
      );

    setCurrentUser(user);

    await loadChildren();

    setPage("profiles");
  };

  const loadChildProgress =
    async (childId: string) => {
      const completedLevels =
        await progressService
          .getCompletedLevels(
            childId
          );

      setCompletedLevelIds(
        completedLevels
      );

      const itemProgressResults =
        await Promise.all(
          levels.map(
            async (level) => {
              const items =
                await progressService
                  .getCompletedItems(
                    childId,
                    level.levelId
                  );

              return {
                levelId:
                  level.levelId,
                count:
                  items.length,
              };
            }
          )
        );

      const counts: Record<
        string,
        number
      > = {};

      itemProgressResults.forEach(
        (result) => {
          counts[result.levelId] =
            result.count;
        }
      );

      setCompletedItemCounts(
        counts
      );
  };

  const handleSelectChild =
    async (
      child: IChildProfile
    ) => {
      setIsLoading(true);

      try {
        setSelectedChild(child);

        await loadChildProgress(
          child.childId
        );

        setPage("home");
      } catch (error) {
        console.error(
          "Could not load child progress:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

  const handleCreateChild =
    async (
      displayName: string,
      avatar: string
    ) => {
      const child =
        await childService.createChild(
          displayName,
          avatar
        );

      setChildren(
        (previousChildren) => [
          ...previousChildren,
          child,
        ]
      );
    };

  const handleSelectLevel =
    async (levelId: string) => {
      if (!selectedChild) {
        return;
      }

      setIsLessonLoading(true);

      try {
        const completedItems =
          await progressService
            .getCompletedItems(
              selectedChild.childId,
              levelId
            );

        setCompletedItemIds(
          completedItems
        );

        setSelectedLevelId(
          levelId
        );

        setPage("lesson");
      } catch (error) {
        console.error(
          "Could not load lesson progress:",
          error
        );
      } finally {
        setIsLessonLoading(false);
      }
    };

  const handleCompleteItem =
    async (
      levelId: string,
      itemId: string
    ) => {
      if (!selectedChild) {
        return;
      }

      const updatedItems =
        await progressService
          .completeItem(
            selectedChild.childId,
            levelId,
            itemId
          );

      setCompletedItemIds(
        updatedItems
      );

      setCompletedItemCounts(
        (previousCounts) => ({
          ...previousCounts,
          [levelId]:
            updatedItems.length,
        })
      );
    };

  const handleCompleteLevel =
    async () => {
      if (
        !selectedChild ||
        !selectedLevel
      ) {
        return;
      }

      const updatedCompletedLevels =
        await progressService
          .completeLevel(
            selectedChild.childId,
            selectedLevel.levelId
          );

      setCompletedLevelIds(
        updatedCompletedLevels
      );

      setPage("complete");
    };

  if (
    isLoading ||
    isLessonLoading
  ) {
    return (
      <main className="learning-home">
        <p>Loading...</p>
      </main>
    );
  }

  if (
    !currentUser &&
    page !== "register"
  ) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoToRegister={() =>
          setPage("register")
        }
      />
    );
  }

  if (page === "register") {
    return (
      <RegisterPage
        onRegister={
          handleRegister
        }
        onGoToLogin={() =>
          setPage("login")
        }
      />
    );
  }

  if (page === "profiles") {
    return (
      <ChildProfilePage
        children={children}
        onSelectChild={
          handleSelectChild
        }
        onCreateChild={
          handleCreateChild
        }
        onLogout={handleLogout}
      />
    );
  }

  if (
    page === "lesson" &&
    selectedLevel
  ) {
    return (
      <LessonPage
        level={selectedLevel}
        completedItemIds={
          completedItemIds
        }
        onBack={() =>
          setPage("home")
        }
        onCompleteItem={
          handleCompleteItem
        }
        onComplete={
          handleCompleteLevel
        }
      />
    );
  }

  if (
    page === "complete" &&
    selectedLevel
  ) {
    return (
      <LevelCompletePage
        levelNumber={
          selectedLevel.levelNumber
        }
        levelTitle={
          selectedLevel.title
        }
        onContinue={() =>
          setPage("home")
        }
      />
    );
  }

  if (!selectedChild) {
  return (
    <ChildProfilePage
      children={children}
      onSelectChild={
        handleSelectChild
      }
      onCreateChild={
        handleCreateChild
      }
      onLogout={
        handleLogout
      }
    />
  );
}

return (
  <ChildHomePage
    childName={
      selectedChild.displayName
    }
    completedLevelIds={
      completedLevelIds
    }
    completedItemCounts={
      completedItemCounts
    }
    onSelectLevel={
      handleSelectLevel
    }
    onSwitchProfile={
      handleSwitchProfile
    }
    onLogout={
      handleLogout
    }
  />
);
}

export default App;