import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const WithdrawIcon = ({ width = 19, height = 20, color = "#fff" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M5.79 11.29C5.69627 11.383 5.62188 11.4936 5.57111 11.6154C5.52034 11.7373 5.4942 11.868 5.4942 12C5.4942 12.132 5.52034 12.2627 5.57111 12.3846C5.62188 12.5064 5.69627 12.617 5.79 12.71L8.79 15.71C8.88296 15.8037 8.99356 15.8781 9.11542 15.9289C9.23728 15.9797 9.36799 16.0058 9.5 16.0058C9.63201 16.0058 9.76272 15.9797 9.88458 15.9289C10.0064 15.8781 10.117 15.8037 10.21 15.71L13.21 12.71C13.3983 12.5217 13.5041 12.2663 13.5041 12C13.5041 11.7337 13.3983 11.4783 13.21 11.29C13.0217 11.1017 12.7663 10.9959 12.5 10.9959C12.2337 10.9959 11.9783 11.1017 11.79 11.29L10.5 12.59V1C10.5 0.734784 10.3946 0.48043 10.2071 0.292893C10.0196 0.105357 9.76522 0 9.5 0C9.23478 0 8.98043 0.105357 8.79289 0.292893C8.60536 0.48043 8.5 0.734784 8.5 1V12.59L7.21 11.29C7.11704 11.1963 7.00644 11.1219 6.88458 11.0711C6.76272 11.0203 6.63201 10.9942 6.5 10.9942C6.36799 10.9942 6.23728 11.0203 6.11542 11.0711C5.99356 11.1219 5.88296 11.1963 5.79 11.29ZM15.5 7H13.5C13.2348 7 12.9804 7.10536 12.7929 7.29289C12.6054 7.48043 12.5 7.73478 12.5 8C12.5 8.26522 12.6054 8.51957 12.7929 8.70711C12.9804 8.89464 13.2348 9 13.5 9H15.5C15.7652 9 16.0196 9.10536 16.2071 9.29289C16.3946 9.48043 16.5 9.73478 16.5 10V17C16.5 17.2652 16.3946 17.5196 16.2071 17.7071C16.0196 17.8946 15.7652 18 15.5 18H3.5C3.23478 18 2.98043 17.8946 2.79289 17.7071C2.60536 17.5196 2.5 17.2652 2.5 17V10C2.5 9.73478 2.60536 9.48043 2.79289 9.29289C2.98043 9.10536 3.23478 9 3.5 9H5.5C5.76522 9 6.01957 8.89464 6.20711 8.70711C6.39464 8.51957 6.5 8.26522 6.5 8C6.5 7.73478 6.39464 7.48043 6.20711 7.29289C6.01957 7.10536 5.76522 7 5.5 7H3.5C2.70435 7 1.94129 7.31607 1.37868 7.87868C0.816071 8.44129 0.5 9.20435 0.5 10V17C0.5 17.7956 0.816071 18.5587 1.37868 19.1213C1.94129 19.6839 2.70435 20 3.5 20H15.5C16.2956 20 17.0587 19.6839 17.6213 19.1213C18.1839 18.5587 18.5 17.7956 18.5 17V10C18.5 9.20435 18.1839 8.44129 17.6213 7.87868C17.0587 7.31607 16.2956 7 15.5 7Z"
      fill={color}
    />
  </Svg>
);

export { WithdrawIcon };
