import "@testing-library/jest-dom";
import { render, renderHook, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "../pages/LoginPage";
import useLogin from "../hooks/useLogin";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("로그인 테스트", () => {
  test("로그인에 실패하면 에러메세지가 나타난다.", async () => {
    // given - 로그인 페이지가 그려짐
    const routes = [
      {
        path: "/login",
        element: <LoginPage />,
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

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
