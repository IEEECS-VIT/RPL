/**
 * Created by burnualive on 10/12/14.
 */
function t_ch(id) {
    if (id < 127) {
        return 1;
    } else if (id < 253) {
        return 2;
    } else if (id < 369) {
        return 3;
    } else {
        return 4;
    }

}
