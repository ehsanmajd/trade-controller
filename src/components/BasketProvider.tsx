import { BasketsContext } from "../context/BasketsContext";
import { useBaskets } from "../hooks/useBaskets";

const BasketProvider: React.FC = ({ children }) => {
  const { refresh, refreshTime, baskets, hasError, reset } = useBaskets();
  return (
    <BasketsContext.Provider value={{ data: { refreshTime, baskets }, refresh, hasError, reset }}>
      {children}
    </BasketsContext.Provider>
  )
}

export default BasketProvider;