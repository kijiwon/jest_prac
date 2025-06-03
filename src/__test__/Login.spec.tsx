import "@testing-library/jest-dom";
import {
  screen,
  render,
  renderHook,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "../pages/LoginPage";
import useLogin from "../hooks/useLogin";
import * as nock from "nock";

const queryClient = new QueryClient({
  defaultOptions: {},
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("로그인 테스트", () => {
  // 테스트 구동 전 console.error가 찍히면 아무것도 하지 않기
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // 원상복귀
  afterAll(() => {
    jest.restoreAllMocks();
  });

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

    // when  - 사용자가 로그인에 실패할 때
    // nock -> 서버로 리퀘스트 가지 않음
    nock("https://inflearn.byeongjinkang.com")
      .post(`/user/login`, {
        email: "wrong@email.com",
        password: "wrongPassword",
      })
      .reply(400, { msg: "SUCH_USER_DOES_NOT_EXIST" });

    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");

    // 잘못된 이메일, 비밀번호 입력
    fireEvent.change(emailInput, { target: { value: "wrong@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongPassword" } });

    // 로그인버튼 클릭
    const loginButton = screen.getByRole("button", { name: "로그인" });
    fireEvent.click(loginButton);

    const { result } = renderHook(() => useLogin(), { wrapper });

    // then - 에러메세지가 나타남
    await waitFor(() => result.current.isError);
    const errorMessage = await screen.findAllByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
  });
});
