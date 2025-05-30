import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import SignupPage from "../pages/SignupPage";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("회원가입 테스트", () => {
  // 다른 테스트와 동일한 조건
  // => 테스트가 구동하기 전에 돌아갈 수 있도록 beforeEach()에 넣음
  beforeEach(() => {
    // given - 회원가입 페이지가 그려짐
    // SignupPage에서 react-router-dom과 react-query를 사용하고 있음
    // -> provider와 queryClient로 묶어줘야힘
    const routes = [
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ];

    // 메모리라우터 사용
    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"],
      initialIndex: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });
  // 비밀번호 에러 메세지 테스트
  test("비밀번호와 비밀번호 확인값이 일치하지 않으면 에러메세지가 표시된다", async () => {
    // when - 비밀번호와 비밀번호 확인값이 일치하지 않음
    // 각각의 input에 change event를 넣어줌

    // Label태그의 text를 가져옴
    const passwordInput = screen.getByLabelText("비밀번호");
    const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");

    // change event 발생
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "wrong-password" },
    });

    // then - 에러메세지가 표시됨
    // ErrorMessage 컴포넌트의 data-testid를 활용해 불러옴
    // 에러메세지가 나타나기 위해 기다려야함 -> await
    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
  });

  // 회원가입 버튼 활성화 테스트
  test("이메일을 입력하고, 비밀번호와 비밀번호 확인값이 일치하면 회원가입 버튼이 활성화된다.", () => {
    // given - 화면이 표시되었을 때 회원가입 버튼이 비활성화된 상태인지 검증
    const signupButton = screen.getByRole("button", { name: "회원가입" });
    expect(signupButton).toBeDisabled();

    // when - 이메일 입력, 비밀번호, 비밀번호 확인값 일치
    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");
    const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");

    fireEvent.change(emailInput, {
      target: { value: "button-activated@email.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password" },
    });

    // then - 회원가입 버튼 활성화
    expect(signupButton).toBeEnabled();
  });
});
