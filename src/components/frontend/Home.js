import React, { useEffect, useState } from 'react';
import '../../assets/frontend/css/main.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AOS from 'aos';

const Home = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
        AOS.init({
            offset: 120,
            delay: 0,
            duration: 900,
            easing: 'ease',
            once: false,
            mirror: false,
            anchorPlacement: 'top-bottom',
        });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const calcScrollValue = () => {
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return Math.round((scrollPosition * 100) / scrollHeight);
    };

    const handleScrollToTop = () => {
        document.documentElement.scrollTop = 0;
    };
    return (
        <>
            <Helmet>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>HOME | Trang Chủ</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" />
                <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css" />
                <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
                <link rel="stylesheet" href="assets/css/style.css" />
            </Helmet>
            <body data-bs-spy="scroll" data-bs-target=".navbar">
                <div id="progress" style={{ display: scrollPosition > 100 ? 'grid' : 'none' }}>
                    <span id="progress-value" onClick={handleScrollToTop}>
                        &#x1F815;
                    </span>
                </div>

                <nav className="navbar navbar-expand-lg bg-white sticky-top">
                    <div className="container">
                        <Link className="navbar-brand" to="/">
                            <img src="./assets/images/fptnew.png" width="150" height="150" alt="" />
                        </Link>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <a className="nav-link" href="#hero">
                                        Trang Chủ
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#services">
                                        Hệ Thống
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#contact">
                                        Liên Hệ
                                    </a>
                                </li>
                            </ul>
                            <Link
                                to="/login"
                                style={{ fontSize: '17px', borderRadius: '10px' }}
                                className="btn btn-brand ms-lg-3"
                            >
                                Đăng Nhập
                            </Link>
                        </div>
                    </div>
                </nav>

                <section id="hero" className="min-vh-100 d-flex align-items-center text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h1
                                    data-text="Xin chào"
                                    data-aos="fade-left"
                                    className="text-uppercase text-white fw-semibold display-1"
                                >
                                    Xin chào
                                </h1>
                                <h5 className="text-white mt-3 mb-4" data-aos="fade-right">
                                    Chúng tôi ở đây để giúp bạn dễ dàng hơn trong việc lựa chọn trường phù hợp cho mình
                                </h5>
                                <div data-aos="fade-up" data-aos-delay="50">
                                    <Link
                                        to="/login"
                                        style={{ fontSize: '17px', borderRadius: '10px' }}
                                        className="btn btn-light ms-2"
                                    >
                                        Đăng Nhập
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="services" className="section-padding border-top">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center" data-aos="fade-down" data-aos-delay="150">
                                <div className="section-title">
                                    <h1 className="display-4 fw-semibold">Công Nghệ</h1>
                                    <div className="line"></div>
                                    <p>
                                        Để khách hàng có thể dễ dàng sử dụng chúng tôi đã tích hợp và sử dụng các công
                                        nghệ mới nhất giúp cho người dùng có thể tiếp cận và sử dụng một cách dễ dàng.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4 text-center">
                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div className="service theme-shadow p-lg-5 p-4">
                                    <div className="iconbox">
                                        <i className="ri-pen-nib-fill"></i>
                                    </div>
                                    <h5 className="mt-4 mb-3">UX Design</h5>
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet fugiat sunt
                                        distinctio?
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="250">
                                <div className="service theme-shadow p-lg-5 p-4">
                                    <div className="iconbox">
                                        <i className="ri-stack-fill"></i>
                                    </div>
                                    <h5 className="mt-4 mb-3">UI Design</h5>
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet fugiat sunt
                                        distinctio?
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="350">
                                <div className="service theme-shadow p-lg-5 p-4">
                                    <div className="iconbox">
                                        <i className="ri-ruler-2-fill"></i>
                                    </div>
                                    <h5 className="mt-4 mb-3">Logo Design</h5>
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet fugiat sunt
                                        distinctio?
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="450">
                                <div className="service theme-shadow p-lg-5 p-4">
                                    <div className="iconbox">
                                        <i className="ri-pie-chart-2-fill"></i>
                                    </div>
                                    <h5 className="mt-4 mb-3">Digital Marketing</h5>
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet fugiat sunt
                                        distinctio?
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="550">
                                <div className="service theme-shadow p-lg-5 p-4">
                                    <div className="iconbox">
                                        <i className="ri-code-box-line"></i>
                                    </div>
                                    <h5 className="mt-4 mb-3">Machine Learning</h5>
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet fugiat sunt
                                        distinctio?
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="650">
                                <div className="service theme-shadow p-lg-5 p-4">
                                    <div className="iconbox">
                                        <i className="ri-user-2-fill"></i>
                                    </div>
                                    <h5 className="mt-4 mb-3">UX Design</h5>
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet fugiat sunt
                                        distinctio?
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-padding bg-light" id="contact">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center" data-aos="fade-down" data-aos-delay="150">
                                <div className="section-title">
                                    <h1 className="display-4 text-white fw-semibold">Liên Hệ Với Chúng Tôi</h1>
                                    <div className="line bg-white"></div>
                                    <p className="text-white">
                                        Chúng tôi sẽ rất sẵn lòng lắng nghe những góp ý cũng như ý kiến của bạn sau khi
                                        trải nghiệm hệ thống của chúng tôi.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center" data-aos="fade-down" data-aos-delay="250">
                            <div className="col-lg-8 change">
                                <form action="#" className="row g-3 p-lg-5 p-4 bg-white theme-shadow">
                                    <div className="form-group col-lg-6">
                                        <input
                                            style={{ borderRadius: '10px' }}
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div className="form-group col-lg-6">
                                        <input
                                            style={{ borderRadius: '10px' }}
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <input
                                            style={{ borderRadius: '10px' }}
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter Email address"
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <input
                                            style={{ borderRadius: '10px' }}
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter subject"
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <textarea
                                            style={{ borderRadius: '10px' }}
                                            name="message"
                                            rows="5"
                                            className="form-control"
                                            placeholder="Enter Message"
                                        ></textarea>
                                    </div>
                                    <div className="form-group col-lg-12 d-grid">
                                        <button className="btn btn-brand" style={{ borderRadius: '10px' }}>
                                            Gửi yêu cầu
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-dark">
                    <div className="footer-top">
                        <div className="container">
                            <div className="row gy-5">
                                <div className="col-lg-3 col-sm-6">
                                    <a href="#">
                                        <img src="./assets/images/fptnew.png" width="150" height="150" alt="" />
                                    </a>
                                    <div className="line"></div>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, hic!</p>
                                    <div className="social-icons">
                                        <a href="#">
                                            <i className="ri-twitter-fill"></i>
                                        </a>
                                        <a href="#">
                                            <i className="ri-instagram-fill"></i>
                                        </a>
                                        <a href="#">
                                            <i className="ri-github-fill"></i>
                                        </a>
                                        <a href="#">
                                            <i className="ri-dribbble-fill"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <h5 className="mb-0 text-white">SERVICES</h5>
                                    <div className="line"></div>
                                    <ul>
                                        <li>
                                            <a href="#">UI Design</a>
                                        </li>
                                        <li>
                                            <a href="#">UX Design</a>
                                        </li>
                                        <li>
                                            <a href="#">Branding</a>
                                        </li>
                                        <li>
                                            <a href="#">Logo Designing</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <h5 className="mb-0 text-white">ABOUT</h5>
                                    <div className="line"></div>
                                    <ul>
                                        <li>
                                            <a href="#">Blog</a>
                                        </li>
                                        <li>
                                            <a href="#">Services</a>
                                        </li>
                                        <li>
                                            <a href="#">Company</a>
                                        </li>
                                        <li>
                                            <a href="#">Career</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <h5 className="mb-0 text-white">CONTACT</h5>
                                    <div className="line"></div>
                                    <ul>
                                        <li>New York, NY 3300</li>
                                        <li>(414) 586 - 3017</li>
                                        <li>www.example.com</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="container">
                            <div className="row g-4 justify-content-between">
                                <div className="col-auto">
                                    <p className="mb-0">© Copyright Group B. All Rights Reserved</p>
                                </div>
                                <div className="col-auto">
                                    <p className="mb-0">Designed with 💜 Group B</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                <div className="snowflakes" aria-hidden="true">
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                </div>

                <style>
                    {`
            @-webkit-keyframes snowflakes-fall {
              0% {top:-10%}
              100% {top:100%}
            }
            @-webkit-keyframes snowflakes-shake {
              0%,100% {-webkit-transform:translateX(0);transform:translateX(0)}
              50% {-webkit-transform:translateX(80px);transform:translateX(80px)}
            }
            @keyframes snowflakes-fall {
              0% {top:-10%}
              100% {top:100%}
            }
            @keyframes snowflakes-shake {
              0%,100%{ transform:translateX(0)}
              50% {transform:translateX(80px)}
            }
            .snowflake {
              color: #fff;
              font-size: 1em;
              font-family: Arial, sans-serif;
              text-shadow: 0 0 5px #000;
              position:fixed;
              top:-10%;
              z-index:9999;
              -webkit-user-select:none;
              -moz-user-selexact:none;
              -ms-user-select:none;
              user-select:none;
              cursor:default;
              -webkit-animation-name:snowflakes-fall,snowflakes-shake;
              -webkit-animation-duration:10s,3s;
              -webkit-animation-timing-function:linear,ease-in-out;
              -webkit-animation-iteration-count:infinite,infinite;
              -webkit-animation-play-state:running,running;
              animation-name:snowflakes-fall,snowflakes-shake;
              animation-duration:10s,3s;
              animation-timing-function:linear,ease-in-out;
              animation-iteration-count:infinite,infinite;
              animation-play-state:running,running;
            }
            .snowflake:nth-of-type(0){
              left:1%;-webkit-animation-delay:0s,0s;animation-delay:0s,0s
            }
            .snowflake:nth-of-type(1){
              left:10%;-webkit-animation-delay:1s,1s;animation-delay:1s,1s
            }
            .snowflake:nth-of-type(2){
              left:20%;-webkit-animation-delay:6s,.5s;animation-delay:6s,.5s
            }
            .snowflake:nth-of-type(3){
              left:30%;-webkit-animation-delay:4s,2s;animation-delay:4s,2s
            }
            .snowflake:nth-of-type(4){
              left:40%;-webkit-animation-delay:2s,2s;animation-delay:2s,2s
            }
            .snowflake:nth-of-type(5){
              left:50%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s
            }
            .snowflake:nth-of-type(6){
              left:60%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s
            }
            .snowflake:nth-of-type(7){
              left:70%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s
            }
            .snowflake:nth-of-type(8){
              left:80%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s
            }
            .snowflake:nth-of-type(9){
              left:90%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s
            }
            .snowflake:nth-of-type(10){
              left:25%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s
            }
            .snowflake:nth-of-type(11){
              left:65%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s
            }
          `}
                </style>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js"></script>
                <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
                <script src="./assets/js/main.js"></script>
            </body>
        </>
    );
};

export default Home;
