import "./App.css";
import AstronautsTable from "./components/AstronautsTable";
import AstroBar from "./components/AstroBar";


function App() {
 /* const [astronauts, setAstronauts] = useState<AstronautModel[]>([]);
  useEffect(() => {
    async function loadAstronauts() {
      try {
        const response = await fetch("http://localhost:5000/api/astronauts", {
          method: "GET",
        });
        const astronauts = await response.json();
        setAstronauts(astronauts);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadAstronauts();
  }, []);

  console.log(astronauts);
*/
  return (
    <div className="App">
      <AstroBar />
         <p></p>
      <AstronautsTable/>
    </div>
  );
}

export default App;
