import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import SignupPage from "../pages/SignupPage";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const queryClient = new QueryClient({ defaultOptions: {} });

describe("회원가입 테스트", () => {
  test("비밀번호와 비밀번호 확인값이 일치하지 않으면 에러메세지가 표시된다", () => {
    // given - 회원가입 페이지가 그려짐
    // SignupPage에서 react-router-dom과 react-query를 사용하고 있음
    // -> provider와 queryClient로 묶어줘야힘
    const routes = [
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"],
      initialIndex: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    // when - 비밀번호와 비밀번호 확인값이 일치하지 않음
    // then - 에러메세지가 표시됨
  });
});
