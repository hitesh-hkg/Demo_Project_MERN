import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAuthStatus, selectUser } from "../features/user/userSlice";
import DeleteProduct from "./DeleteProduct";
import EditProduct from "./EditProduct";


const ProductCard = ({product}) => {
    let Auth = useSelector(selectAuthStatus);
    let user = useSelector(selectUser);
    return<div className={`d-flex flex-row align-middle justify-content-center flex-lg-column card ProductCard flex-fill ${Auth=='succes' && user.role=='Admin'?'row-cols-3':'row-cols-2'} row-cols-lg-1`}>
            <div className='d-inline-block flex-grow-1 col align-middle justify-content-center card-header'>
                <Link classNmae='align-middle justify-content-center row'to={`/products/${product.pid}/details`}>
                    <img  className="col img-fluid align-middle justify-content-center  card-img-top" src={product.img} alt={`${product.name}`}/>
                </Link>
            </div>
            <div className="d-inline-block col align-middle justify-content-center card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p class="card-text">{product.category}</p>
                    <p class="card-text badge bg-warning">{product.price}</p>
            </div>
            {Auth=='success' && user.role=='Admin' && <div className='d-inline-block col align-middle justify-content-center card-footer'>
                <div className='row row-cols-1 row-cols-lg-2'>
                    <div className='col d-flex'><EditProduct pid={product.pid}/></div>
                    <div className='col d-flex'><DeleteProduct pid={product.pid}/></div>
                </div>
            </div>}
        </div>
}

export default ProductCard;