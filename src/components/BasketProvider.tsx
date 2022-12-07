import { BasketsContext } from "../context/BasketsContext";
import { useBaskets } from "../hooks/useBaskets";

const BasketProvider: React.FC = ({ children }) => {
  const { refresh, refreshTime, baskets, hasError, reset, refresh2 } = useBaskets();
  return (
    <BasketsContext.Provider value={{ data: { refreshTime, baskets }, refresh, refresh2, hasError, reset }}>
      {children}
    </BasketsContext.Provider>
  )
}

export default BasketProvider;